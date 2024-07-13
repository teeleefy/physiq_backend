const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(family) {
  console.assert(family.isAdmin !== undefined,
      "createToken passed family without isAdmin property");

  let payload = {
    familyId: family.id,
    email: family.email,
    name: family.name,
    memberIds: family.memberIds,
    isAdmin: family.isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
