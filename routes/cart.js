const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Get cart for current session
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.session.id }).populate('items.productId');
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    let cart = await Cart.findOne({ sessionId: req.session.id });
    
    if (!cart) {
      cart = new Cart({ sessionId: req.session.id, items: [] });
    }
    
    // Check if item already exists
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    
    await cart.save();
    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;