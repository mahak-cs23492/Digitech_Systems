import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        shippingAddress: user.shippingAddress,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        shippingAddress: user.shippingAddress,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        shippingAddress: user.shippingAddress,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      if (req.body.shippingAddress) {
        user.shippingAddress = {
          address: req.body.shippingAddress.address ?? user.shippingAddress.address,
          city: req.body.shippingAddress.city ?? user.shippingAddress.city,
          postalCode: req.body.shippingAddress.postalCode ?? user.shippingAddress.postalCode,
          country: req.body.shippingAddress.country ?? user.shippingAddress.country,
        };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        shippingAddress: updatedUser.shippingAddress,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/users/stats
// @access  Private/Admin
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();

    // Sum total sales (only from paid orders)
    const paidOrders = await Order.find({ isPaid: true });
    const totalSales = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Get simple sales monthly breakdown for chart (simulated based on order timestamps)
    // Grouping paid orders by month
    const monthlySales = Array(12).fill(0).map((_, idx) => ({
      month: new Date(2026, idx, 1).toLocaleString('en-US', { month: 'short' }),
      sales: 0,
      orders: 0
    }));

    paidOrders.forEach(order => {
      if (order.paidAt) {
        const monthIdx = new Date(order.paidAt).getMonth();
        if (monthIdx >= 0 && monthIdx < 12) {
          monthlySales[monthIdx].sales += order.totalPrice;
          monthlySales[monthIdx].orders += 1;
        }
      }
    });

    res.json({
      metrics: {
        usersCount,
        productsCount,
        ordersCount,
        totalSales: Math.round(totalSales * 100) / 100
      },
      monthlySales
    });
  } catch (error) {
    next(error);
  }
};

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getAdminDashboardStats,
};
