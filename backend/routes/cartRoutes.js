import express from 'express';
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartItems, // 
} from '../controllers/cartController.js';

import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, addToCart);              // POST /cart
router.get('/', verifyToken, getCartItems);            // GET /cart (view items)
router.put('/:id', verifyToken, updateCartItem);       // PUT /cart/:id
router.delete('/:id', verifyToken, removeFromCart);    // DELETE /cart/:id

export default router;
