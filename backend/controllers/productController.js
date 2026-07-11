import Product from '../models/Product.js';

// @desc    Fetch all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      featured,
      bestSeller,
      newArrival,
      sortBy,
      isAdminView
    } = req.query;

    const query = {};

    // By default, hide products from normal customers
    if (isAdminView !== 'true') {
      query.isHidden = { $ne: true };
    }

    // Keyword Search
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Category Filter
    if (category) {
      query.category = category;
    }

    // Brand Filter
    if (brand) {
      query.brand = brand;
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Tag Filters
    if (featured === 'true') query.featured = true;
    if (bestSeller === 'true') query.bestSeller = true;
    if (newArrival === 'true') query.newArrival = true;

    // Sorting
    let sortQuery = { createdAt: -1 }; // Default new arrivals first
    if (sortBy === 'price-asc') sortQuery = { price: 1 };
    else if (sortBy === 'price-desc') sortQuery = { price: -1 };
    else if (sortBy === 'rating') sortQuery = { rating: -1 };

    const products = await Product.find(query).sort(sortQuery);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      discountPrice,
      description,
      brand,
      category,
      stock,
      images,
      specifications,
      featured,
      bestSeller,
      newArrival,
      isHidden
    } = req.body;

    const product = new Product({
      name,
      price,
      discountPrice: discountPrice || 0,
      description,
      brand,
      category,
      stock: stock || 0,
      images: images || [],
      specifications: specifications || {},
      featured: featured || false,
      bestSeller: bestSeller || false,
      newArrival: newArrival || false,
      isHidden: isHidden || false,
      rating: 0,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      discountPrice,
      description,
      brand,
      category,
      stock,
      images,
      specifications,
      featured,
      bestSeller,
      newArrival,
      isHidden
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
      product.description = description || product.description;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.images = images || product.images;
      product.specifications = specifications || product.specifications;
      product.featured = featured !== undefined ? featured : product.featured;
      product.bestSeller = bestSeller !== undefined ? bestSeller : product.bestSeller;
      product.newArrival = newArrival !== undefined ? newArrival : product.newArrival;
      product.isHidden = isHidden !== undefined ? isHidden : product.isHidden;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed by you');
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
