const express = require('express');

// Initialising routes
const router = express.Router();

// Fetching Functions to route to
const { registerUser, loginUser, logoutUser } = require('./../controllers/user');

// Defining different routes
router
  .get('/signup', async (req, res) => {
    return res.render("signup");
  })
  .post('/signup', registerUser);

router
  .get('/login', async (req, res) => {
    return res.render("login",
      { loginAttempted: true, loginSuccess: false, loginMessage: 'Session Timed-out, Kindly login again !!!' });
  })
  .post('/login', loginUser);

router
  .get('/logout', logoutUser);

module.exports = router;