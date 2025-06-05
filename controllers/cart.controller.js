const Cart = require('../models/cart.models');
const Product = require('../models/products.models');
const mongoose = require('mongoose');

function cartController() {
  return {
    // ✅ Add Product to Cart
    async addToCart(req, res) {
      const { userId, productId, quantity } = req.body;

      // Validate required fields
      if (!userId || !productId) {
        return res
          .status(400)
          .json({ message: 'userId and productId are required.' });
      }

      try {
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }

        // Check if cart exists for this user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
          // Create new cart for user
          cart = new Cart({ userId, items: [] });
        }

        // Check if product already exists in the cart
        const existingItemIndex = cart.items.findIndex(
          item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
          // If exists, update quantity
          cart.items[existingItemIndex].quantity += quantity || 1;
        } else {
          // Else, push new product
          cart.items.push({ productId, quantity: quantity || 1 });
        }

        cart.updatedAt = new Date();

        await cart.save();

        return res.status(200).json({
          success: true,
          message: 'Product added to cart',
          cart,
        });

        /*
          React frontend usage example:
          const res = await axios.post('/api/cart/add', {
            userId: currentUser.id,
            productId: selectedProduct.id,
            quantity: 1,
          });
          if (res.data.success) alert("Added to cart");
        */
      } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  };
}

module.exports = cartController;
