const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')();
const adminController = require('../controllers/admin.controller')();

// ******** DEMO ROUTES ********

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.get('/api', (req, res) => {
  res.send('Hello Postman APIs');
});

// ******** USER POST ROUTES ********

// User Registration Route
router.post('/api/userRegister', userController.registerUser);

// User Login Route
router.post('/api/userLogin', userController.loginUser);

// User Update Route
router.patch('/api/userUpdate/:id', userController.updateUser);

// User Delete Route
router.delete('/api/userDelete/:id', userController.deleteUser);

// ******** ADMIN POST ROUTES ********

// Admin Registration Route
router.post('/api/adminRegister', adminController.registerAdmin);

// Admin Login Route
router.post('/api/adminLogin', adminController.loginAdmin);

// Admin Update Route
router.patch('/api/adminUpdate/:id', adminController.updateAdmin);

// Admin Delete Route
router.delete('/api/adminDelete/:id', adminController.deleteAdmin);

module.exports = router;
