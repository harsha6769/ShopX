const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    name: String,
    image: String,
    price: Number,
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    }
  }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
 status: {
    type: String,
    enum: [
      'pending',
      'confirmed', 
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled'
    ],
    default: 'pending'
  },
  payment: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed'], 
      default: 'pending' 
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);