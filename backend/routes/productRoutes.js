import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/productController.js';
import {
  bulkImportProducts,
  downloadSampleCSV,
  downloadSampleExcel,
} from '../controllers/bulkImportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

// Dedicated Multer instance for Bulk Import to support .csv, .xlsx, .zip and image formats
const bulkUpload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  }),
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.csv', '.xlsx', '.xls', '.zip', '.jpg', '.jpeg', '.png', '.webp'];
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File format ${ext} is not supported. Please upload CSV, Excel, ZIP or image files only.`));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

const router = express.Router();

router.get('/sample/csv', downloadSampleCSV);
router.get('/sample/excel', downloadSampleExcel);

router.route('/').get(getProducts).post(protect, admin, createProduct);

router.post(
  '/bulk-import',
  protect,
  admin,
  bulkUpload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'zip', maxCount: 1 },
    { name: 'images', maxCount: 500 },
  ]),
  bulkImportProducts
);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
