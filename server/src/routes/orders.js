import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import Order from '../models/Order.js';
import User from '../models/User.js'; // Assuming you have a User model for isAdmin middleware
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for JWT Secret

// Middleware to verify JWT token (similar to auth in auth.js)
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

// Multer configuration for payment proof uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'public/uploads/payment_proofs');
    // Ensure the directory exists
    // You might need a more robust solution for creating directories if they don't exist
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadPaymentProof = multer({ storage });

// Create a new order (Client)
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0 || !totalAmount || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Please provide all required order details' });
    }

    const order = new Order({
      userId: req.user._id,
      clientName: req.user.name,
      clientEmail: req.user.email,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error during order creation' });
  }
});

// Get all orders for the authenticated user (Client Dashboard)
router.get('/me', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ orderDate: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Get all orders (Admin Dashboard)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
});

// Upload payment proof (Client)
router.post('/:id/payment-proof', auth, uploadPaymentProof.single('paymentProof'), async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the order belongs to the authenticated user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only upload proof for your own orders.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No payment proof file uploaded' });
    }

    order.paymentProof = `/uploads/payment_proofs/${req.file.filename}`;
    order.paymentStatus = 'pending'; // Set to pending review upon upload
    order.updatedAt = Date.now();
    await order.save();

    res.json({ message: 'Payment proof uploaded successfully', order });
  } catch (error) {
    console.error('Error uploading payment proof:', error);
    res.status(500).json({ message: 'Server error uploading payment proof' });
  }
});

// Update payment status (Admin)
router.put('/:id/payment-status', auth, isAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status provided' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = status;
    order.updatedAt = Date.now();
    await order.save();

    res.json({ message: `Payment status updated to ${status}`, order });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Server error updating payment status' });
  }
});

// Update delivery status (Admin)
router.put('/:id/delivery-status', auth, isAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status provided' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryStatus = status;
    order.updatedAt = Date.now();
    await order.save();

    res.json({ message: `Delivery status updated to ${status}`, order });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ message: 'Server error updating delivery status' });
  }
});

export default router; 