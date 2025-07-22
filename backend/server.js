// Import necessary dependencies
import express from 'express'; 
import cors from 'cors';          // Middleware to handle Cross-Origin Resource Sharing (CORS)
import dotenv from 'dotenv';      // Loads environment variables from a .env file into process.env
import mongoose from 'mongoose';  // Mongoose helps connect and interact with MongoDB

// Import route files
import authRoutes from './routes/authRoutes.js';     // Routes for user registration and login
import cartRoutes from './routes/cartRoutes.js';     // Routes for cart operations (add, update, remove)
import productRoutes from './routes/productRoutes.js'; // Routes for product-related operations

// Initialize environment variables (from .env file)
dotenv.config();

// Initialize the Express application
const app = express();

// Setup CORS middleware to allow requests from frontend (http://localhost:5173)
// This is required to allow the frontend (likely running on Vite) to communicate with the backend
app.use(cors({
  origin: 'http://localhost:5173', // Only allow requests from this origin
  credentials: true,               // Allow cookies and authorization headers (if used)
}));

// ✅ Middleware to parse incoming JSON requests
// This allows Express to understand JSON bodies in POST, PUT requests
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected')) // Show success message on connection
  .catch(err => console.error('MongoDB connection error:', err)); // Show error message if failed

// Define all API routes and attach route handlers
// All /api/auth/* requests will be handled by authRoutes
app.use('/api/auth', authRoutes);

// All /api/cart/* requests will be handled by cartRoutes
app.use('/api/cart', cartRoutes);

// All /api/products/* requests will be handled by productRoutes
app.use('/api/products', productRoutes);

//Optional: Catch-all route for undefined paths
// If the user tries to access a route that doesn't exist, respond with a 404 message
app.use((req, res) => {
  res.status(404).send(`Route not found: ${req.method} ${req.originalUrl}`);
});

// Start the server on the specified port
// If PORT is defined in environment variables, use that. Otherwise, default to 5000.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
