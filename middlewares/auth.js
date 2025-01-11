const { getUser } = require('../service/auth-token');
const sessionExpiry = 20 * 60 * 1000; // 20 minutes
const _ = require('underscore');

function checkforAuthentication(req, res, next) {
  const authHeaderValue = req.headers["Authorization"];
  req.user = null;

  if (!authHeaderValue || !authHeaderValue.startswith("Bearer"))
    return next();

  const token = authHeaderValue.split("Bearer ")[1];
  const userData = getUser(token);

  req.user = userData;
  return next();
}

function restrictToRoles(roles) {
  return function (req, res, next) {
    const authHeaderValue = req.cookies?.uid;

    if (!authHeaderValue) return res.redirect("/user/login");
    const userData = getUser(authHeaderValue);
    if (!userData) return res.redirect("/user/login");
    // console.log('userData - ', userData);
    // console.log('userData.sessionCreatedTime - ', userData.sessionCreatedTime);
    // console.log('all session valid created after - ', new Date(new Date() - sessionExpiry));

    if (userData && userData.sessionCreatedTime && new Date(userData.sessionCreatedTime) < new Date(new Date() - sessionExpiry)) {
      console.log('Session Timed-out for - ', userData.name);
      return res.redirect("/user/login");
    }

    const userRoles = userData.roles && userData.roles.length > 0 ? _.pluck(userData.roles, "name") : [];

    if (_.intersection(userRoles, roles).length == 0) {
      console.log('User does not have given role priviledge - ', roles);
      return res.redirect("/user/login");
    }
    // console.log('userData in auth middleware - ', userData);

    req.user = userData;
    next();
  };
}

async function requestToLoggedInUserOnly(req, res, next) {
  let authToken = req.headers["Authorization"];

  if (!authToken) return res.redirect("/user/login");

  if (!authHeaderValue || !authHeaderValue.startswith("Bearer"))
    return next();

  const token = authHeaderValue.split("Bearer ")[1];
  const userData = getUser(token);

  if (!userData) return res.redirect("/user/login");

  req.user = userData;

  next();
}

async function checkAuthForHome(req, res, next) {
  let authHeaderValue = req.headers["authorization"];

  if (!authHeaderValue || !authHeaderValue.startsWith("Bearer"))
    return next();

  const token = authHeaderValue.split("Bearer ")[1];
  const userData = getUser(token);

  // if (user && user.sessionCreatedTime && new Date(user.sessionCreatedTime) < new Date(allowedSessionTime)) {
  //   console.log('Session Timed-out for - ', user.name);
  //   return res.redirect("/user/login");
  // }
  req.user = userData;

  next();
}

async function checkAuthForUser(req, res, next) {
  let authToken = req.cookies?.uid;
  console.log('Got inside checkAuthForUser - ');
  if (!authToken) next();

  next();
}

module.exports = { requestToLoggedInUserOnly, checkAuthForHome, checkAuthForUser, checkforAuthentication, restrictToRoles };