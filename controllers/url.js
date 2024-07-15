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

async function fetchAllURLData(req, res) {

  let response = await URL.find();

  return res.json({ returnData: response });
}

async function getLongUrl(req, res) {
  let params = req.params;

  if (!params) {
    return res.status(400), json({ error: "No Parameters passed!" });
  }
  if (!params.shortId) {
    return res.status(400), json({ error: "Short URL is required!" });
  }
  let shortUrl = params.shortId;

  let longUrlObject = await URL.findOne({
    shortId: shortUrl
  });
  let longUrlData = longUrlObject.redirectUrl;

  longUrlObject.visitHistory;

  return res.json({ longUrl: longUrlData });
}

module.exports = { generateNewShortURL, fetchAllURLData, getLongUrl }