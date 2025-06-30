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

// Add item to cart (with optional size)
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    let cart = await Cart.findOne({ sessionId: req.session.id });

    if (!cart) {
      cart = new Cart({ sessionId: req.session.id, items: [] });
    }

    // Match product by ID and size (optional)
    const existingItem = cart.items.find(item =>
      item.productId.toString() === productId &&
      (item.size || '') === (size || '')
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, size });
    }

    await cart.save();
    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart (with optional size)
router.delete('/remove', async (req, res) => {
  try {
    const { productId, size } = req.body;

    let cart = await Cart.findOne({ sessionId: req.session.id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item =>
      !(item.productId.toString() === productId && (item.size || '') === (size || ''))
    );

    await cart.save();
    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item quantity (with optional size)
router.put('/update', async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    let cart = await Cart.findOne({ sessionId: req.session.id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(item =>
      item.productId.toString() === productId &&
      (item.size || '') === (size || '')
    );

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;

    await cart.save();
    res.json({ message: 'Quantity updated', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
