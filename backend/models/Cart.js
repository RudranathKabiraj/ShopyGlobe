import mongoose from 'mongoose';

// This defines the schema for a single item inside the cart (i.e., one product with quantity)
const cartItemSchema = new mongoose.Schema({
  // The 'product' field stores the ObjectId of a Product document.
  // It uses a reference to the Product model, enabling population of full product details later.
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true // Ensures that a product is always linked for each cart item.
  },
  // 'quantity' indicates how many units of the product are added to the cart.
  quantity: {
    type: Number,
    required: true, // Quantity is mandatory
    min: 1 // Quantity must be at least 1 to avoid empty or zero-value items
  }
});

// This is the main Cart schema, representing the entire cart for one user.
const cartSchema = new mongoose.Schema(
  {
    // The 'user' field stores the ObjectId of the User who owns the cart.
    // It uses a reference to the User model.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true // Each cart must belong to a registered user
    },
    // 'items' is an array of cartItemSchema — each item includes product ID and quantity.
    items: [cartItemSchema]
  },
  {
    timestamps: true // This automatically adds 'createdAt' and 'updatedAt' fields to each cart document.
  }
);

// Create the Cart model using the schema defined above
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;