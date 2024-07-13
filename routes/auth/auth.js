"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const Family = require("../../models/families/family");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../../helpers/tokens");
const familyAuthSchema = require("../../schemas/families/familyAuth.json");
const familyRegisterSchema = require("../../schemas/families/familyRegister.json");
const { BadRequestError } = require("../../expressError");

/** POST /auth/token:  { email, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    //Check that request body matches appropriate authorization schema
    const validator = jsonschema.validate(req.body, familyAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    //check to see if email and password authenticated
    const { email, password } = req.body;
    const family = await Family.authenticate(email, password);
    const token = createToken(family);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


/** POST /auth/register:   { family } => { token }
 *
 * family must include { email, password, name }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, familyRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newFamily = await Family.register({ ...req.body, isAdmin: false });
    const token = createToken(newFamily);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
