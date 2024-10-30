const { getUser } = require('../service/auth');

async function requestToLoggedInUserOnly(req, res, next) {

  let authToken = req.cookies?.uid;

  if (!authToken) return res.redirect("/login");

  let user = getUser(authToken);

  if (!user) return res.redirect("/login");

  req.user = user;

  next();
}

async function checkAuth(req, res, next) {

  let authToken = req.cookies?.uid;
  if (!authToken) return res.redirect("/login");

  let user = getUser(authToken);

  req.user = user;

  next();
}

module.exports = { requestToLoggedInUserOnly, checkAuth };