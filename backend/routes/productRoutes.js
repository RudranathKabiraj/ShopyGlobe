import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  decrementProductStock,
  updateProduct,
  deleteProduct, // ✅ import the delete controller
} from '../controllers/productController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);                     // GET /api/products
router.get('/:id', getProductById);                  // GET /api/products/:id

// Protected routes
router.post('/', verifyToken, createProduct);        // POST /api/products
router.put('/:id/decrement', verifyToken, decrementProductStock); // PUT /api/products/:id/decrement
router.put('/:id', verifyToken, updateProduct); // PUT /api/products/:id

router.delete('/:id', verifyToken, deleteProduct);   //DELETE /api/products/:id

export default router;
