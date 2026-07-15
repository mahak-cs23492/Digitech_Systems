import Product from '../models/Product.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import XLSX from 'xlsx';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

// Helper to match field names case-insensitively and ignoring whitespace/delimiters
const getRowValue = (row, aliases) => {
  for (const alias of aliases) {
    const matchedKey = Object.keys(row).find(
      (k) => k.toLowerCase().replace(/[\s_-]/g, '') === alias.toLowerCase().replace(/[\s_-]/g, '')
    );
    if (matchedKey !== undefined && row[matchedKey] !== null && row[matchedKey] !== '') {
      return row[matchedKey];
    }
  }
  return undefined;
};

// Recursively find all files in a directory
const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
};

// Escape special characters for regex
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const bulkImportProducts = async (req, res, next) => {
  // Set headers for streaming progress back to client
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const sendProgress = (status, extra = {}) => {
    res.write(JSON.stringify({ status, ...extra }) + '\n');
  };

  let extractPath = null;
  let tempFilesToCleanup = [];

  try {
    sendProgress('reading_excel', { message: 'Initializing import...' });

    // Validate uploaded files
    const excelFile = req.files?.file?.[0];
    const zipFile = req.files?.zip?.[0];
    const folderFiles = req.files?.images || [];

    if (!excelFile) {
      sendProgress('completed', {
        success: false,
        error: 'Spreadsheet file (CSV/Excel) is required.',
      });
      return res.end();
    }

    tempFilesToCleanup.push(excelFile.path);
    if (zipFile) {
      tempFilesToCleanup.push(zipFile.path);
    }
    folderFiles.forEach(f => tempFilesToCleanup.push(f.path));

    // Get options from request body
    const importMode = req.body.importMode || 'create_only'; // 'create_only' or 'update_existing'
    const imageMode = req.body.imageMode || 'replace'; // 'replace' or 'append'

    // 1. Process Spreadsheet
    sendProgress('reading_excel', { message: 'Reading spreadsheet file...' });
    let workbook;
    try {
      workbook = XLSX.readFile(excelFile.path);
    } catch (err) {
      sendProgress('completed', {
        success: false,
        error: `Failed to read Excel/CSV file: ${err.message}`,
      });
      return res.end();
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet);

    if (rawRows.length === 0) {
      sendProgress('completed', {
        success: false,
        error: 'The uploaded file contains no data rows.',
      });
      return res.end();
    }

    // 2. Process Images
    sendProgress('reading_excel', { message: 'Scanning image archives...' });
    const uploadedImagesList = [];

    // If ZIP file was uploaded, extract it
    if (zipFile) {
      try {
        const zip = new AdmZip(zipFile.path);
        extractPath = path.join('uploads', `extracted-${Date.now()}`);
        fs.mkdirSync(extractPath, { recursive: true });
        zip.extractAllTo(extractPath, true);

        const extractedPaths = getAllFiles(extractPath);
        extractedPaths.forEach((fpath) => {
          const ext = path.extname(fpath).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            uploadedImagesList.push({
              originalName: path.basename(fpath),
              path: fpath,
              isExtracted: true,
            });
          }
        });
      } catch (err) {
        sendProgress('completed', {
          success: false,
          error: `Failed to extract image ZIP: ${err.message}`,
        });
        return res.end();
      }
    }

    // If folder images were uploaded via webkitdirectory
    if (folderFiles && folderFiles.length > 0) {
      folderFiles.forEach((file) => {
        uploadedImagesList.push({
          originalName: file.originalname,
          path: file.path,
          isExtracted: false,
        });
      });
    }

    // 3. Row-by-row parsing and validation
    sendProgress('reading_excel', { message: 'Validating product fields...' });
    const validatedRows = [];
    const errors = [];

    let totalProducts = rawRows.length;
    let failedImports = 0;
    let missingImagesCount = 0;
    let duplicateProductsCount = 0;

    // We'll normalize fields aliases
    const aliases = {
      name: ['Product Name', 'Name', 'Title'],
      brand: ['Brand'],
      category: ['Category'],
      description: ['Description', 'Desc'],
      price: ['Price'],
      discountPrice: ['Discount Price', 'Discounted Price', 'Discount'],
      stock: ['Stock Quantity', 'Stock', 'Quantity', 'Qty'],
      featured: ['Featured'],
      imageFileName: ['Image File Name', 'ImageFileName', 'Image', 'Images'],
      modelNumber: ['Model Number', 'ModelNumber', 'Model'],
      processor: ['Processor', 'CPU'],
      ram: ['RAM', 'Memory'],
      storage: ['Storage', 'HDD', 'SSD'],
      graphics: ['Graphics', 'GPU'],
      displaySize: ['Display Size', 'DisplaySize', 'Display'],
      operatingSystem: ['Operating System', 'OS'],
      warranty: ['Warranty'],
      color: ['Color', 'Colour'],
    };

    // Keep track of rows inside the sheet to prevent sheet-level duplicates
    const sheetDuplicates = new Set();

    for (let index = 0; index < rawRows.length; index++) {
      const rawRow = rawRows[index];
      const rowNum = index + 2; // Row number in sheet (1-based header is row 1)

      const name = getRowValue(rawRow, aliases.name);
      const brand = getRowValue(rawRow, aliases.brand);
      const category = getRowValue(rawRow, aliases.category);
      const description = getRowValue(rawRow, aliases.description);
      const priceVal = getRowValue(rawRow, aliases.price);
      const discountPriceVal = getRowValue(rawRow, aliases.discountPrice);
      const stockVal = getRowValue(rawRow, aliases.stock);
      const featuredVal = getRowValue(rawRow, aliases.featured);
      const imageFileName = getRowValue(rawRow, aliases.imageFileName);

      const modelNumber = getRowValue(rawRow, aliases.modelNumber);
      const processor = getRowValue(rawRow, aliases.processor);
      const ram = getRowValue(rawRow, aliases.ram);
      const storage = getRowValue(rawRow, aliases.storage);
      const graphics = getRowValue(rawRow, aliases.graphics);
      const displaySize = getRowValue(rawRow, aliases.displaySize);
      const operatingSystem = getRowValue(rawRow, aliases.operatingSystem);
      const warranty = getRowValue(rawRow, aliases.warranty);
      const color = getRowValue(rawRow, aliases.color);

      const displayName = name || 'Unknown Product';

      // Required fields validation
      if (!name) {
        errors.push({ row: rowNum, error: 'Product Name is required', name: displayName });
        failedImports++;
        continue;
      }
      if (!brand) {
        errors.push({ row: rowNum, error: 'Brand is required', name: displayName });
        failedImports++;
        continue;
      }
      if (!category) {
        errors.push({ row: rowNum, error: 'Category is required', name: displayName });
        failedImports++;
        continue;
      }
      if (!description) {
        errors.push({ row: rowNum, error: 'Description is required', name: displayName });
        failedImports++;
        continue;
      }

      // Numbers validation
      const price = Number(priceVal);
      if (isNaN(price) || price <= 0) {
        errors.push({ row: rowNum, error: `Invalid Price: "${priceVal}". Price must be positive.`, name: displayName });
        failedImports++;
        continue;
      }

      let discountPrice = 0;
      if (discountPriceVal !== undefined) {
        discountPrice = Number(discountPriceVal);
        if (isNaN(discountPrice) || discountPrice < 0) {
          errors.push({ row: rowNum, error: `Invalid Discount Price: "${discountPriceVal}"`, name: displayName });
          failedImports++;
          continue;
        }
        if (discountPrice > price) {
          errors.push({ row: rowNum, error: `Discount Price (${discountPrice}) cannot be greater than regular Price (${price})`, name: displayName });
          failedImports++;
          continue;
        }
      }

      let stock = 0;
      if (stockVal !== undefined) {
        stock = parseInt(stockVal, 10);
        if (isNaN(stock) || stock < 0) {
          errors.push({ row: rowNum, error: `Invalid Stock Quantity: "${stockVal}"`, name: displayName });
          failedImports++;
          continue;
        }
      }

      // Featured mapping
      let featured = false;
      if (featuredVal !== undefined) {
        const normFeat = String(featuredVal).trim().toLowerCase();
        featured = ['yes', 'true', '1', 'y'].includes(normFeat);
      }

      // Check duplicates within sheet itself
      const sheetKey = `${name.trim().toLowerCase()}|${brand.trim().toLowerCase()}|${(modelNumber || '').trim().toLowerCase()}`;
      if (sheetDuplicates.has(sheetKey)) {
        errors.push({ row: rowNum, error: 'Duplicate product entry within the spreadsheet.', name: displayName });
        duplicateProductsCount++;
        failedImports++;
        continue;
      }
      sheetDuplicates.add(sheetKey);

      // Build specs
      const specifications = {};
      if (modelNumber) specifications['Model Number'] = String(modelNumber).trim();
      if (processor) specifications['Processor'] = String(processor).trim();
      if (ram) specifications['RAM'] = String(ram).trim();
      if (storage) specifications['Storage'] = String(storage).trim();
      if (graphics) specifications['Graphics'] = String(graphics).trim();
      if (displaySize) specifications['Display Size'] = String(displaySize).trim();
      if (operatingSystem) specifications['Operating System'] = String(operatingSystem).trim();
      if (warranty) specifications['Warranty'] = String(warranty).trim();
      if (color) specifications['Color'] = String(color).trim();

      // Find matched images in the uploaded ZIP/folder
      const matchedImages = [];
      if (imageFileName) {
        const cleanImageFileName = String(imageFileName).trim();
        const baseName = cleanImageFileName.replace(/\.[^/.]+$/, "").toLowerCase();
        
        const tempMatches = [];
        for (const file of uploadedImagesList) {
          const lowerName = file.originalName.toLowerCase();
          const fileBaseName = file.originalName.replace(/\.[^/.]+$/, "").toLowerCase();
          
          if (lowerName === cleanImageFileName.toLowerCase()) {
            tempMatches.push({ file, order: 0 });
          } else {
            // Check if it matches baseName-[number]
            const regex = new RegExp(`^${escapeRegExp(baseName)}-(\\d+)$`);
            const match = fileBaseName.match(regex);
            if (match) {
              tempMatches.push({ file, order: parseInt(match[1], 10) });
            }
          }
        }

        // Sort matches
        tempMatches.sort((a, b) => a.order - b.order);
        tempMatches.forEach(m => matchedImages.push(m.file));

        if (matchedImages.length === 0) {
          errors.push({ row: rowNum, error: `Image file "${cleanImageFileName}" not found in uploaded images.`, name: displayName });
          missingImagesCount++;
          failedImports++;
          continue;
        }
      }

      validatedRows.push({
        row: rowNum,
        name: name.trim(),
        brand: brand.trim(),
        category: category.trim(),
        description: description.trim(),
        price,
        discountPrice,
        stock,
        featured,
        specifications,
        matchedImages, // List of { originalName, path, isExtracted }
      });
    }

    // 4. Batch query database to identify duplicates and updates
    sendProgress('reading_excel', { message: 'Checking database for existing products...' });
    const existingCache = new Map(); // key: "name|brand|model" -> product

    if (validatedRows.length > 0) {
      for (let i = 0; i < validatedRows.length; i += 200) {
        const batch = validatedRows.slice(i, i + 200);
        const query = batch.map(r => ({
          name: r.name,
          brand: r.brand,
          'specifications.Model Number': r.specifications['Model Number'] || ''
        }));
        
        const found = await Product.find({ $or: query });
        for (const prod of found) {
          const modelNum = prod.specifications instanceof Map 
            ? prod.specifications.get('Model Number')
            : prod.specifications?.['Model Number'];
          
          const key = `${prod.name.trim().toLowerCase()}|${prod.brand.trim().toLowerCase()}|${(modelNum || '').trim().toLowerCase()}`;
          existingCache.set(key, prod);
        }
      }
    }

    // Filter rows based on duplicates settings
    const finalRowsToImport = [];
    for (const row of validatedRows) {
      const key = `${row.name.trim().toLowerCase()}|${row.brand.trim().toLowerCase()}|${(row.specifications['Model Number'] || '').trim().toLowerCase()}`;
      const existing = existingCache.get(key);

      if (existing) {
        if (importMode === 'create_only') {
          errors.push({ row: row.row, error: `Product already exists (Duplicate name + brand + model).`, name: row.name });
          duplicateProductsCount++;
          failedImports++;
        } else {
          // Update existing
          finalRowsToImport.push({ ...row, existingProduct: existing });
        }
      } else {
        // New product
        finalRowsToImport.push({ ...row, existingProduct: null });
      }
    }

    // 5. Upload matched images to Cloudinary (or copy locally)
    const imagesToUpload = [];
    finalRowsToImport.forEach(row => {
      row.matchedImages.forEach(img => {
        if (!imagesToUpload.find(x => x.path === img.path)) {
          imagesToUpload.push(img);
        }
      });
    });

    const isCloudinary = isCloudinaryConfigured();
    const uploadedImagesMap = new Map(); // path -> Url string
    const totalImages = imagesToUpload.length;

    sendProgress('uploading_images', { current: 0, total: totalImages });

    for (let i = 0; i < totalImages; i++) {
      const img = imagesToUpload[i];
      sendProgress('uploading_images', { 
        current: i, 
        total: totalImages, 
        message: `Uploading image ${i + 1}/${totalImages} (${img.originalName})...` 
      });

      try {
        if (isCloudinary) {
          // Cloudinary Upload
          const result = await cloudinary.uploader.upload(img.path, {
            folder: 'digitech_systems',
          });
          uploadedImagesMap.set(img.path, result.secure_url);
        } else {
          // Local Upload fallback
          const fileExtension = path.extname(img.originalName);
          const uniqueName = `bulk-image-${Date.now()}-${Math.floor(Math.random() * 1000000)}${fileExtension}`;
          const destPath = path.join('uploads', uniqueName);
          fs.copyFileSync(img.path, destPath);
          uploadedImagesMap.set(img.path, `/uploads/${uniqueName}`);
        }
      } catch (err) {
        console.error('Image upload failed in bulk import:', err);
        // Fallback to default placeholder image URL if upload fails
        uploadedImagesMap.set(img.path, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600');
      }
    }

    sendProgress('uploading_images', { current: totalImages, total: totalImages, message: 'All images processed.' });

    // 6. Bulk write to MongoDB
    sendProgress('creating_products', { message: 'Writing products to database...' });

    const bulkOps = [];
    let successfullyImported = 0;
    let updatedProductsCount = 0;

    for (const row of finalRowsToImport) {
      // Map local temp paths to actual uploaded URLs
      const imageUrls = row.matchedImages.map(img => uploadedImagesMap.get(img.path)).filter(Boolean);
      
      // Fallback if no images matches
      if (imageUrls.length === 0) {
        imageUrls.push('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600');
      }

      if (row.existingProduct) {
        // Update product
        const updateDoc = {
          $set: {
            name: row.name,
            description: row.description,
            brand: row.brand,
            category: row.category,
            price: row.price,
            discountPrice: row.discountPrice,
            stock: row.stock,
            specifications: row.specifications,
            featured: row.featured,
          }
        };

        if (imageMode === 'replace') {
          updateDoc.$set.images = imageUrls;
        } else {
          // Append
          updateDoc.$addToSet = { images: { $each: imageUrls } };
        }

        bulkOps.push({
          updateOne: {
            filter: { _id: row.existingProduct._id },
            update: updateDoc
          }
        });
        updatedProductsCount++;
        successfullyImported++;
      } else {
        // Insert product
        bulkOps.push({
          insertOne: {
            document: {
              name: row.name,
              description: row.description,
              brand: row.brand,
              category: row.category,
              price: row.price,
              discountPrice: row.discountPrice,
              stock: row.stock,
              images: imageUrls,
              specifications: row.specifications,
              featured: row.featured,
              bestSeller: false,
              newArrival: false,
              isHidden: false,
              rating: 0,
              numReviews: 0,
            }
          }
        });
        successfullyImported++;
      }
    }

    if (bulkOps.length > 0) {
      // Run bulk writes in batches of 500 for maximum stability
      for (let i = 0; i < bulkOps.length; i += 500) {
        const batchOps = bulkOps.slice(i, i + 500);
        await Product.bulkWrite(batchOps);
      }
    }

    sendProgress('creating_products', { message: 'Database writes completed.' });

    // Completed response with detailed report
    sendProgress('completed', {
      success: true,
      summary: {
        total: totalProducts,
        success: successfullyImported,
        failed: failedImports,
        missingImages: missingImagesCount,
        duplicates: duplicateProductsCount,
        updated: updatedProductsCount,
      },
      errors: errors,
    });

  } catch (error) {
    console.error('Bulk import general error:', error);
    sendProgress('completed', {
      success: false,
      error: error.message || 'An unexpected error occurred during import.',
    });
  } finally {
    // Cleanup temporary folders and files
    if (extractPath && fs.existsSync(extractPath)) {
      try {
        fs.rmSync(extractPath, { recursive: true, force: true });
      } catch (err) {
        console.error('Failed to cleanup extracted directory:', err);
      }
    }
    tempFilesToCleanup.forEach((fpath) => {
      if (fpath && fs.existsSync(fpath)) {
        try {
          fs.unlinkSync(fpath);
        } catch (err) {
          console.error(`Failed to cleanup temp file: ${fpath}`, err);
        }
      }
    });

    res.end();
  }
};

export const downloadSampleCSV = (req, res) => {
  const headers = [
    'Product Name', 'Brand', 'Category', 'Model Number', 'Description', 'Price',
    'Discount Price', 'Stock Quantity', 'Processor', 'RAM', 'Storage', 'Graphics',
    'Display Size', 'Operating System', 'Warranty', 'Color', 'Featured (Yes/No)', 'Image File Name'
  ];
  const row1 = [
    'HP Victus 15 Gaming Laptop', 'HP', 'Laptops', '15-fa0350tx', 'Experience intense gaming performance.', '64999', '59999', '10', 'AMD Ryzen 5 5600H', '16 GB', '512 GB SSD', 'NVIDIA RTX 3050', '15.6 inch', 'Windows 11', '1 Year', 'Performance Blue', 'Yes', 'hp-victus-15.jpg'
  ];
  const row2 = [
    'Dell Inspiron 3520', 'Dell', 'Laptops', 'IN-3520', 'High performance everyday laptop.', '55999', '52999', '15', 'Intel Core i5-1235U', '8 GB', '512 GB SSD', 'Intel Iris Xe', '15.6 inch', 'Windows 11', '1 Year', 'Platinum Silver', 'No', 'dell-inspiron-3520.jpg'
  ];
  
  const csvContent = [headers, row1, row2]
    .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    .join('\n');
    
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=sample-products.csv');
  res.status(200).send(csvContent);
};

export const downloadSampleExcel = (req, res) => {
  const headers = [
    'Product Name', 'Brand', 'Category', 'Model Number', 'Description', 'Price',
    'Discount Price', 'Stock Quantity', 'Processor', 'RAM', 'Storage', 'Graphics',
    'Display Size', 'Operating System', 'Warranty', 'Color', 'Featured (Yes/No)', 'Image File Name'
  ];
  const row1 = [
    'HP Victus 15 Gaming Laptop', 'HP', 'Laptops', '15-fa0350tx', 'Experience intense gaming performance.', 64999, 59999, 10, 'AMD Ryzen 5 5600H', '16 GB', '512 GB SSD', 'NVIDIA RTX 3050', '15.6 inch', 'Windows 11', '1 Year', 'Performance Blue', 'Yes', 'hp-victus-15.jpg'
  ];
  const row2 = [
    'Dell Inspiron 3520', 'Dell', 'Laptops', 'IN-3520', 'High performance everyday laptop.', 55999, 52999, 15, 'Intel Core i5-1235U', '8 GB', '512 GB SSD', 'Intel Iris Xe', '15.6 inch', 'Windows 11', '1 Year', 'Platinum Silver', 'No', 'dell-inspiron-3520.jpg'
  ];

  const data = [headers, row1, row2];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=sample-products.xlsx');
  res.status(200).send(buffer);
};
