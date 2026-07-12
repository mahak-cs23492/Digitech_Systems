import express from 'express';
import { submitContactForm, getContactMessages } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitContactForm)
  .get(protect, admin, getContactMessages);

export default router;
