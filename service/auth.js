// const currentActiveSessions = new Map();

const JWT = require('jsonwebtoken');
const secret = 'Anmol@123$%^';

function setUser(user) {
  // currentActiveSessions.set(tokenId, userId);

  return JWT.sign(user, secret);
}
function getUser(tokenId) {
  // return currentActiveSessions.get(tokenId);
  if (!tokenId) return null;

  return JWT.verify(tokenId, secret);
}

module.exports = { getUser, setUser };