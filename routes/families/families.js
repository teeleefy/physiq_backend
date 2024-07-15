"use strict";

/** Routes for families. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Family = require("../../models/families/family");
const { createToken } = require("../../helpers/tokens");
const familyNewSchema = require("../../schemas/families/familyNew.json");
const familyUpdateSchema = require("../../schemas/families/familyUpdate.json");

const router = new express.Router();

/** POST / { family } => { family, token }
 *
 * Adds a new family. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users/families. The new user being added can be an
 * admin.
 *
 * This returns the newly created user/family and an authentication token for them:
 *  {family: { id, email, name, isAdmin }, token }
 *
 * Authorization required: admin
 * 
 * family must include { email, password, name, isAdmin }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: admin
 */

router.post("/", 
  // ensureAdmin,
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, familyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newFamily = await Family.register(req.body);
    const token = createToken(newFamily);
    return res.status(201).json({ newFamily, token });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { families: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const families = await Family.findAll();
      return res.json({ families });
    } catch (err) {
      return next(err);
    }
  });
  
  /** GET /[id] => { family }
 *
 * Returns { id, email, name, is_admin, family_members }
   *   where family_member is { id, first_name, last_name }
 *
 * Authorization required: admin or same  family id-as-:id
 **/

router.get("/:id", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const family = await Family.get(req.params.id);
    return res.json({ family });
  } catch (err) {
    return next(err);
  }
});







/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or correct user
 */

router.delete("/:id", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    await Family.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;