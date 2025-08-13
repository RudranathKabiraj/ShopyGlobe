// Importing createSlice from Redux Toolkit to easily create actions and reducers
import { createSlice } from "@reduxjs/toolkit";

// Creating a Redux slice named "cart"
const cartSlice = createSlice({
  name: "cart",

  // Initial state of the cart: it starts with an empty list of items
  initialState: {
    items: [], // Each item will be an object: { _id, name, price, thumbnail, quantity }
  },

  // Reducers define how the state should change based on actions
  reducers: {
    // Action to add a product to the cart
    addToCart: (state, action) => {
      const product = action.payload;

      // Check if the product already exists in the cart
      const existingItem = state.items.find((item) => item._id === product._id);

      if (existingItem) {
        // If it exists, just increase the quantity
        existingItem.quantity += 1;
      } else {
        // If not, add the product to the cart with quantity 1
        state.items.push({ ...product, quantity: 1 });
      }
    },

    // Action to remove a product completely from the cart
    removeFromCart: (state, action) => {
      const id = action.payload;

      // Remove the item whose _id matches the given id
      state.items = state.items.filter((item) => item._id !== id);
    },

    // Action to increase the quantity of a specific product
    increaseQuantity: (state, action) => {
      const id = action.payload;

      // Find the item and increase its quantity
      const item = state.items.find((item) => item._id === id);
      if (item) {
        item.quantity += 1;
      }
    },

    // Action to decrease the quantity of a specific product
    decreaseQuantity: (state, action) => {
      const id = action.payload;

      // Find the item in the cart
      const item = state.items.find((item) => item._id === id);

      if (item && item.quantity > 1) {
        // If quantity is more than 1, decrease it by 1
        item.quantity -= 1;
      } else {
        // If quantity is 1 or less, remove the item from the cart
        state.items = state.items.filter((item) => item._id !== id);
      }
    },

    // Action to directly set all cart items (e.g., when loading from backend or localStorage)
    setCartItems: (state, action) => {
      state.items = action.payload; // Replace existing items with new ones
    },

    // Action to clear the cart (e.g., after successful checkout)
    clearCart: (state) => {
      state.items = []; // Remove all items
    },
  },
});

// Exporting action creators so they can be used in components
export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setCartItems,
  clearCart,
} = cartSlice.actions;

// Exporting the reducer so it can be used in the Redux store
export default cartSlice.reducer;
