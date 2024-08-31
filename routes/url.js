const express = require('express');

// Initialising routes
const router = express.Router();

// Fetching Functions to route to
const { generateNewShortURL, fetchAllURLData, getLongUrl } = require('./../controllers/url');

// Defining different routes
router
  .post('/', generateNewShortURL)
  .get('/', fetchAllURLData);

router
  .get('/:shortId', getLongUrl);

module.exports = router;