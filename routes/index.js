const express = require('express');
const router = express.Router();
const User = require('../models/user.models');

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.get('/api', (req, res) => {
  res.send('Hello Postman APIs');
});

module.exports = router;
