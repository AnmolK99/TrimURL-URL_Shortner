const { getUser } = require('../service/auth');
const sessionExpiry = 20 * 60 * 1000; // 20 minutes

async function requestToLoggedInUserOnly(req, res, next) {
  let authToken = req.cookies?.uid;

  if (!authToken) return res.redirect("/login");

  let user = getUser(authToken);

  if (!user) return res.redirect("/login");

  req.user = user;

  next();
}

async function checkAuthForHome(req, res, next) {
  let authToken = req.cookies?.uid;
  console.log('Got inside checkAuthForHome - ');
  if (!authToken) return res.redirect("/user/login");

  let user = getUser(authToken);
  let allowedSessionTime = new Date(new Date().getTime() - sessionExpiry);

  if (user && user.sessionCreatedTime && new Date(user.sessionCreatedTime) < new Date(allowedSessionTime)) {
    console.log('Session Timed-out for - ', user.name);
    return res.redirect("/user/login");
  }
  req.user = user;

  next();
}

async function checkAuthForUser(req, res, next) {
  let authToken = req.cookies?.uid;
  console.log('Got inside checkAuthForUser - ');
  if (!authToken) next();

  next();
}

module.exports = { requestToLoggedInUserOnly, checkAuthForHome, checkAuthForUser };