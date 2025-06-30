const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const Product = require('./models/Product');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');


const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your Next.js frontend URL
  credentials: true // Important for sessions
}));

app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use product routes
app.use('/api/products', productRoutes);

// Use cart routes
app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/admin', adminRoutes);

// Test session route
app.get('/api/test-session', (req, res) => {
  if (!req.session.visits) {
    req.session.visits = 0;
  }
  req.session.visits++;
  res.json({ 
    message: 'Session working!', 
    visits: req.session.visits,
    sessionId: req.session.id 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});