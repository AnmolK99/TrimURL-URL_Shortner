const currentActiveSessions = new Map();

function setUser(tokenId, userId) {
  currentActiveSessions.set(tokenId, userId);
}
function getUser(tokenId) {
  return currentActiveSessions.get(tokenId);
}

module.exports = { getUser, setUser };