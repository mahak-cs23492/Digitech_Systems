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
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/sample/csv', downloadSampleCSV);
router.get('/sample/excel', downloadSampleExcel);

router.route('/').get(getProducts).post(protect, admin, createProduct);

router.post(
  '/bulk-import',
  protect,
  admin,
  upload.fields([
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
