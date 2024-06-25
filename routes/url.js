const express = require('express');

const router = express.Router();

const { generateNewShortURL } = require('./../controllers/url');

router.post('/', generateNewShortURL);

module.exports = router;