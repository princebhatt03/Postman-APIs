const Product = require('../models/products.models');
const mongoose = require('mongoose');

function productController() {
  return {
    // Create a new product
    async createProduct(req, res) {
      const { productName, productImage, price, description, optionalDetails } =
        req.body;

      if (!productName || !productImage || !price || !description) {
        return res.status(400).json({ message: 'Required fields missing.' });
      }

      try {
        const newProduct = new Product({
          productName,
          productImage,
          price,
          description,
          optionalDetails,
        });

        await newProduct.save();

        return res.status(201).json({
          success: true,
          message: 'Product created successfully',
          product: newProduct,
        });

        /*
                  React frontend usage example:
                  if (res.data.success) {
                    alert("Product added");
                    navigate('/products');
                  }
                */
      } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // Update product by ID
    async updateProduct(req, res) {
      const { id } = req.params;
      const { productName, productImage, price, description, optionalDetails } =
        req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }

      try {
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields only if they are explicitly present in the req.body
        if (req.body.hasOwnProperty('productName'))
          product.productName = productName;
        if (req.body.hasOwnProperty('productImage'))
          product.productImage = productImage;
        if (req.body.hasOwnProperty('price')) product.price = price;
        if (req.body.hasOwnProperty('description'))
          product.description = description;
        if (req.body.hasOwnProperty('optionalDetails'))
          product.optionalDetails = optionalDetails;

        product.updatedAt = new Date();

        const updatedProduct = await product.save();

        return res.status(200).json({
          success: true,
          message: 'Product updated successfully',
          product: updatedProduct,
        });
      } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // Delete product by ID
    async deleteProduct(req, res) {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }

      try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({
          success: true,
          message: 'Product deleted successfully',
          product: deletedProduct,
        });

        /*
                  React frontend usage example:
                  const res = await axios.delete(`/api/products/delete/${productId}`);
                  if (res.data.success) {
                    alert("Product deleted");
                    navigate('/products');
                  }
                */
      } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  };
}

module.exports = productController;
