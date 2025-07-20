const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from backend/.env
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Check MONGO_URI is loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection failed:", err));

// Import Routes
const authRoutes = require('./backend/routes/authRoutes');
const outpassRoutes = require('./backend/routes/outpassRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/outpass', outpassRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
