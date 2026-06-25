import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Fetch all products from DummyJSON
    console.log('⏳ Fetching products from DummyJSON...');
    const response = await fetch('https://dummyjson.com/products?limit=194&skip=0');
    
    if (!response.ok) {
      throw new Error(`DummyJSON API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 API Response:', JSON.stringify(Object.keys(data)));

    if (!data.products) {
      throw new Error('No products found in API response');
    }

    const products = data.products;
    console.log(`📦 Fetched ${products.length} products from DummyJSON`);

    const formattedProducts = products.map(p => ({
      name: p.title,
      price: p.price,
      description: p.description,
      stock: p.stock,
      thumbnail: p.thumbnail,
      brand: p.brand || 'Generic',
      category: p.category,
    }));

    await Product.deleteMany();
    console.log('🗑️ Cleared existing products');

    await Product.insertMany(formattedProducts);
    console.log(`✅ ${formattedProducts.length} products seeded successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding:', err.message);
    process.exit(1);
  }
};

seedDB();