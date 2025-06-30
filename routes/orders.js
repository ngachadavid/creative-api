const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { customer, delivery, payment } = req.body;
    const sessionId = req.session.id;

    // 1. Validate required fields
    if (!customer || !delivery || !payment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2. Find the cart for this session
    const cart = await Cart.findOne({ sessionId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or not found' });
    }

    // 3. Calculate total (you can use same logic from frontend if needed)
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.quantity * 1); // price not stored in cart, just placeholder
    }, 0); // Backend must use product price for real apps

    // 4. Create and save the order
    const order = new Order({
      sessionId,
      customer,
      delivery,
      payment,
      items: cart.items,
      total
    });

    await order.save();

    // 5. Optionally clear the cart
    await Cart.deleteOne({ sessionId });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
