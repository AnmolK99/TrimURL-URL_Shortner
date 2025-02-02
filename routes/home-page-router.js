const express = require('express');
const URL = require('../models/url');

const router = express.Router();

router.get('/', async (req, res) => {
  // console.log('req.user - ', req.user);

  if (!req.user) return res.redirect("/login");

  if (!req.user._id) return res.json({ ERR: "Invalid User login !!!" });

  let allURLs = await URL.find({ createdBy: req.user._id });

  return res.render("home", {
    allUrlStat: allURLs
  });
});

router.get('/signup', async (req, res) => {
  return res.render("signup");
})

router.get('/login', async (req, res) => {
  return res.render("login");
})

module.exports = router;