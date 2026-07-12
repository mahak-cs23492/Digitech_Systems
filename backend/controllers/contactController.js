import Contact from '../models/Contact.js';

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    return next(new Error('Name, email, and message content are required'));
  }

  try {
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Message submitted successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
