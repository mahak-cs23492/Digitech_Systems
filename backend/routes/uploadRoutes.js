import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import fs from 'fs';

const router = express.Router();

router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const urls = [];
    const configured = isCloudinaryConfigured();

    for (const file of req.files) {
      if (configured) {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'digitech_systems',
        });
        urls.push(result.secure_url);
        // Remove local file from uploads
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } else {
        // Local upload path
        // We will construct URL path, server will serve '/uploads' statically
        const relativeUrl = `/uploads/${file.filename}`;
        urls.push(relativeUrl);
      }
    }

    res.json({ urls });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
});

export default router;
