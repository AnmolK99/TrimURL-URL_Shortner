const express = require('express');
const URL = require('./../models/url');

const router = express.Router();

// const { generateNewShortURL, fetchAllURLData, getLongUrl } = require('./../controllers/url');

// router
//   .post('/', generateNewShortURL)
//   .get('/', fetchAllURLData);

// router
//   .get('/:shortId', getLongUrl);

router.get('/', async (req, res) => {
  let allURLs = await URL.find();

  return res.render("home", {
    allUrlStat: allURLs
  });
});

module.exports = router;