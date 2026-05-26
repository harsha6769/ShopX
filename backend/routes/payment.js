const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// CREATE ORDER
router.post('/create-order', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) 
        return res.status(404).json({ message: `Product not found` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity: item.quantity
      });
    }

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    // Save order in DB
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      payment: { 
        razorpay_order_id: razorpayOrder.id, 
        status: 'pending' 
      }
    });

    res.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VERIFY PAYMENT
router.post('/verify', protect, async (req, res) => {
  try {
    const { 
      orderId, 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { 
        'payment.status': 'failed', 
        status: 'cancelled' 
      });
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update order
    const order = await Order.findByIdAndUpdate(orderId, {
      status: 'confirmed',
      'payment.razorpay_payment_id': razorpay_payment_id,
      'payment.razorpay_signature': razorpay_signature,
      'payment.status': 'paid'
    }, { new: true });

    // Reduce stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { 
        $inc: { stock: -item.quantity } 
      });
    }

    res.json({ message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;