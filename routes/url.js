const express = require('express');

const router = express.Router();

const { generateNewShortURL, fetchAllURLData, getLongUrl } = require('./../controllers/url');

router
  .post('/', generateNewShortURL)
  .get('/', fetchAllURLData);

router
  .get('/:shortId', getLongUrl);

module.exports = router;