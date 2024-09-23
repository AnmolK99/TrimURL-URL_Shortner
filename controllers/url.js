// const { nanoid, customAlphabet } = require('nanoid');
// import { nanoid, customAlphabet } from 'nanoid';

const shortid = require('shortid');
const URL = require('./../models/url');

async function generateNewShortURL(req, res) {

  let body = req.body;
  if (!body || !body.originalUrl) {
    return res.status(400).json({ error: "URL is required!" });
  }

  let shortId = shortid();
  console.log('nanoId created - ', shortId);

  let urlObject = await URL.findOne({
    redirectUrl: body.originalUrl
  });
  if (urlObject) {
    return res.status(400).json({ error: `URL already shorted; Short URL - ${urlObject.shortId}` });
  } else {
    await URL.create({
      shortId: shortId,
      redirectUrl: body.originalUrl,
      visitHistory: [],
      createdBy: req.user
    });
  }

  return res.render('home', {
    id: shortId
  });
  // return res.json({ id: shortId });
}

async function fetchAllURLData(req, res) {

  let userData = req.user;

  console.log('Token id to fetch all URLs - ', userData._id);

  let response = await URL.find({ createdBy: userData._id });

  return res.render("homepage",
    { urlData: response });
  // return res.json({ returnData: response });
}

async function getLongUrl(req, res) {
  let params = req.params;
  let longUrlData, visitHistory, lastVisit;

  if (!params) {
    return res.status(400).json({ error: "No Parameters passed!" });
  }
  if (!params.shortId) {
    return res.status(400).json({ error: "Short URL is required!" });
  }
  console.log('Short url tried - ', params.shortId);
  let longUrlObject = await URL.findOne({
    shortId: params.shortId
  });

  if (!longUrlObject) {
    return res.status(400).json({ error: "URL not registered Yet !!!" });
  }
  longUrlData = longUrlObject.redirectUrl;

  visitHistory = longUrlObject.visitHistory;
  lastVisit = visitHistory && visitHistory.length > 0 ? visitHistory[visitHistory.length - 1] : null;

  const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  visitHistory.push({ ip: ipAddress, hitTime: new Date() });

  longUrlObject.visitHistory = visitHistory;
  let savedData = await longUrlObject.save();

  return res.redirect(longUrlData);
  // return res.json({ longUrl: longUrlData, lastVisitDate: lastVisit });
}

module.exports = { generateNewShortURL, fetchAllURLData, getLongUrl }