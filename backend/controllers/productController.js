import Product from '../models/Product.js';

// This function gets the list of all products from the database
// Route: GET /api/products
// Access: Public (anyone can access)

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Get all products
    res.json(products); // Send them as response
  } catch (err) {
    // If something goes wrong, send error message
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//-------------------------------------------------------------------------------------------
// This function gets one product using its ID
// Route: GET /api/products/:id
// Access: Public

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Find product by ID

    if (!product) {
      // If product not found, send 404 error
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product); // Send product as response
  } catch (err) {
    // If error happens, log and send error message
    console.error(`Error fetching product with ID ${req.params.id}:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//---------------------------------------------------------------------------------------
// This function creates a new product and saves it in the database
// Route: POST /api/products
// Access: Private (admin only)

// Import your Product model at the top

// Controller function to create a new product
export const createProduct = async (req, res) => {
  // Destructure all required fields from the request body
  const { name, price, description, stock, thumbnail, brand, category } = req.body;

  // Basic validation to ensure essential fields are present
  if (!name || !price || !stock || !brand || !category) {
    return res.status(400).json({
      message: 'Name, price, stock, brand, and category are required'
    });
  }

  try {
    // Create a new product instance with all provided fields
    const product = new Product({
      name,
      price,
      description,
      stock,
      thumbnail,
      brand,
      category
    });

    // Save the product to the database
    await product.save();

    // Return success response
    res.status(201).json(product);
  } catch (err) {
    console.error('❌ Error creating product:', err.message);
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};


//-----------------------------------------------------------------------------------------
// This function deletes a product using its ID
// Route: DELETE /api/products/:id
// Access: Private

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', deletedProduct });
  } catch (err) {
    console.error(`Error deleting product with ID ${req.params.id}:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
//----------------------------------------------------------------------------------------

// This function updates product details using its ID
// Route: PUT /api/products/:id
// Access: Private

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,    // Product ID
      req.body,         // New values
      { new: true, runValidators: true } // Options to return updated and run validation
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', updated });
  } catch (err) {
    console.error(`Error updating product ${req.params.id}:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
//---------------------------------------------------------------------------------------

// This function reduces the stock of a product by 1
// Route: PUT /api/products/:id/decrement
// Access: Private

export const decrementProductStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Find product by ID

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: 'Product out of stock' });
    }

    product.stock -= 1; // Reduce stock by 1
    await product.save(); // Save changes

    res.json({ message: 'Stock decremented', product });
  } catch (err) {
    console.error(`Error decrementing stock for product ${req.params.id}:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
