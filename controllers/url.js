// const { nanoid, customAlphabet } = require('nanoid');
// import { nanoid, customAlphabet } from 'nanoid';

const shortid = require('shortid');
const URL = require('./../models/url');

async function generateNewShortURL(req, res) {

  let body = req.body;
  if (!body || !body.originalUrl) {
    return res.status(400), json({ error: "URL is required!" });
  }

  let shortId = shortid();
  console.log('nanoId created - ', shortId);


  await URL.create({
    shortId: shortId,
    redirectUrl: body.originalUrl,
    visitHistory: []
  });

  return res.json({ id: shortId });
}

module.exports = { generateNewShortURL }