// const currentActiveSessions = new Map();

const JWT = require('jsonwebtoken');
const secret = 'TrimUrl@123$%^';

function setUser(userData) {
  // currentActiveSessions.set(tokenId, userId);
  userData['sessionCreatedTime'] = new Date();
  return JWT.sign(userData, secret);
}
function getUser(tokenId) {
  // return currentActiveSessions.get(tokenId);
  if (!tokenId) return null;

  return JWT.verify(tokenId, secret);
}

module.exports = { getUser, setUser };