const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  AdminID: { type: Number, required: true, unique: true },
  adminUsername: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
