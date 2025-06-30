const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  customer: {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true },
    phone:     { type: String, required: true }
  },
  delivery: {
    address:    { type: String, required: true },
    city:       { type: String, required: true },
    county:     { type: String, required: true },
    postalCode: { type: String }
  },
  payment: {
    method:     { type: String, enum: ['mpesa', 'cod'], required: true },
    mpesaPhone: { type: String } // Optional if method is not mpesa
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity:  { type: Number, required: true }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
