import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

//----------------------------------------------------------------------------
//  Add a product to the user's cart
// @route   POST /api/cart
// @access  Private (Login required)
export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  //  Validate input
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }
  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // If no cart, create a new one
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // If cart exists, update or add item
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // If product already in cart, increase quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Else, add new product to cart
        cart.items.push({ product: productId, quantity });
      }
    }
    await cart.save();
    //  Re-fetch cart with product details included
    const populatedCart = await Cart.findOne({ user: userId }).populate('items.product');
    res.status(200).json(populatedCart);

  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//------------------------------------------------------------------------------------
// Update quantity of a specific cart item
// @route   PUT /api/cart/:id
// @access  Private (Login required)
export const updateCartItem = async (req, res) => {
  const userId = req.user._id;
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  // Check if quantity is valid
  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  try {
    //  Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    //  Find the cart item
    const item = cart.items.id(cartItemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    //  Update item quantity
    item.quantity = quantity;
    await cart.save();

    //  Return updated cart
    const populatedCart = await Cart.findOne({ user: userId }).populate('items.product');
    res.status(200).json(populatedCart);

  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//--------------------------------------------------------------------------------------
// Remove a specific item from cart
// @route   DELETE /api/cart/:id
// @access  Private (Login required)
export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const cartItemId = req.params.id;

  try {
    //  Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    //  Check if item exists
    const itemExists = cart.items.some(item => item._id.toString() === cartItemId);
    if (!itemExists) return res.status(404).json({ message: 'Item not found in cart' });

    //  Remove the item from cart
    cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);
    await cart.save();

    //  Return updated cart with product details
    const populatedCart = await Cart.findOne({ user: userId }).populate('items.product');

    res.status(200).json({
      message: 'Item removed from cart successfully',
      cart: populatedCart,
    });

  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//----------------------------------------------------------------------------------
// Get all cart items for the logged-in user
// @route   GET /api/cart
// @access  Private (Login required)
export const getCartItems = async (req, res) => {
  const userId = req.user._id;

  try {
    //  Find user's cart with product details
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    //  If cart is empty, return empty items array
    if (!cart) return res.status(200).json({ items: [] });

    res.status(200).json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
