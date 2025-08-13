import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({

  // 'name' is the name/title of the product (e.g., "Laptop")
  // It is required and must be a string
  name: { type: String, required: true },

  // 'price' stores the cost of the product
  // It is required and must be a number
  price: { type: Number, required: true },

  // 'description' provides details about the product
  // It is required and must be a string
  description: { type: String, required: true },

  // 'stock' represents how many items are available in inventory
  // It is required and must be a number
  stock: { type: Number, required: true },

  // 'thumbnail' is an optional URL for a product image
  // If not provided, it defaults to an empty string
  thumbnail: { type: String, default: '' },

  // 'brand' is the manufacturer or company name of the product (e.g., "Samsung")
  // It is required and must be a string
  brand: { type: String, required: true },

  // 'category' helps classify the product (e.g., "Electronics", "Clothing")
  // It is required and must be a string
  category: { type: String, required: true }

}, { 
  // 'timestamps' automatically adds createdAt and updatedAt fields to each product
  timestamps: true 
});

// Create a Mongoose model named 'Product' using the schema above
// This model represents the 'products' collection in MongoDB
const Product = mongoose.model('Product', productSchema);

export default Product;
