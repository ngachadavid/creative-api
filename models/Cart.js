const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
     size: {
      type: String 
    }
  }]
});

module.exports = mongoose.model('Cart', cartSchema);