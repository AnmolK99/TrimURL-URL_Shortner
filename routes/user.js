const express = require('express');

// Initialising routes
const router = express.Router();

// Fetching Functions to route to
const { registerUser, loginUser } = require('./../controllers/user');

// Defining different routes
router
  .post('/signup', registerUser);

router
  .post('/login', loginUser);


module.exports = router;