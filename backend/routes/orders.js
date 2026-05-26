const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET MY ORDERS
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE ORDER
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images');

    if (!order) 
      return res.status(404).json({ message: 'Order not found' });
    
    if (order.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL ORDERS - admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE ORDER STATUS - admin only
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST /api/orders/cod — Cash on Delivery
router.post('/cod', protect, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: 'Product not found' });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity: item.quantity
      });

      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      status: 'confirmed',
      payment: { status: 'pending' }
    });

    res.status(201).json({ message: 'COD Order placed!', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;