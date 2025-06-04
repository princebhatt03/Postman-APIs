const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  optionalDetails: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
