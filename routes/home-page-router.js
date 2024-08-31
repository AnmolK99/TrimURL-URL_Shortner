const express = require('express');
const URL = require('../models/url');

const router = express.Router();

router.get('/', async (req, res) => {
  let allURLs = await URL.find();

  return res.render("home", {
    allUrlStat: allURLs
  });
});

module.exports = router;