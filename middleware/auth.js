"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");
const Family = require("../models/families/family");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    // console.log(`Authorization: ${req.headers.authorization}`)
    // console.log(`authHeader: ${authHeader}`)
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      // console.log(`Token: ${token}`)
      // console.log('BEFORE JWT VERIFY')
      let family = jwt.verify(token, SECRET_KEY);
      // console.log('AFTER JWT VERIFY')
      // console.log(`JWT family: ${family.familyId}`);
      res.locals.family = family;
      
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.family) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.family || !res.locals.family.isAdmin) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}



/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectFamilyOrAdmin(req, res, next) {
  try {
    const family = res.locals.family;
    if (!(family && (family.isAdmin || family.familyId === +req.params.familyId))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

// /** Middleware to use when they must provide a valid token & be user matching
//  *  username provided as route param.
//  *
//  *  If not, raises Unauthorized.
//  */

async function ensureCorrectMemberOrAdmin(req, res, next) {
  try {
    const family = res.locals.family;
    
    if (!(family && (family.isAdmin || family.memberIds.includes(+req.params.id)))) {
      const updatedFamily = await Family.get(family.familyId);
      if(!(family && updatedFamily.memberIds.includes(+req.params.id))){
        throw new UnauthorizedError();
      }
    }
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectFamilyOrAdmin,
  ensureCorrectMemberOrAdmin,
};
