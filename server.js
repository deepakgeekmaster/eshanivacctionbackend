const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const path = require('path');

const propertyRoutes = require('./routes/propertyRoutes');

// Initialize dotenv for environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware to parse incoming JSON and form-data
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
}));
// Connect to MongoDB
const uri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(uri, {
  dbName: 'test', // Replace with your database name
})
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if the connection fails
  });


// Use the property routes
app.use('/api', propertyRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up a basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

// Server listening
const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
