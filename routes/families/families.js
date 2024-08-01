"use strict";

/** Routes for families. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectFamilyOrAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Family = require("../../models/families/family");
const Member = require("../../models/members/member");
const { createToken } = require("../../helpers/tokens");
const familyNewSchema = require("../../schemas/families/familyNew.json");
const familyUpdateSchema = require("../../schemas/families/familyUpdate.json");
const familyPasswordUpdateSchema = require("../../schemas/families/familyPasswordUpdate.json");
const memberNewSchema = require("../../schemas/members/memberNew.json");
const router = new express.Router();

/** POST /familyId/members { member } =>  { member }
 *
 *
   * data should be { firstName, lastName, birthday }
   *
   * Returns { id, familyId, firstName, lastName, birthday }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/:familyId/members", 
  ensureCorrectFamilyOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, memberNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    if(!req.body.birthday){
      req.body.birthday = null;
    }
    const familyId = +req.params.familyId;
    const member = await Member.create(req.body, familyId);
    return res.status(201).json({ member });
  } catch (err) {
    return next(err);
  }
});

  
  /** GET /[familyId] => { family }
 *
 * Returns { id, email, name, is_admin, family_members }
   *   where family_member is { id, first_name, last_name }
 *
 * Authorization required: admin or same  family id-as-:id
 **/

router.get("/:familyId", 
  ensureCorrectFamilyOrAdmin, 
  async function (req, res, next) {
  try {
    const family = await Family.get(req.params.familyId);
    return res.json({ family });
    // return res.json({ family });
  } catch (err) {
    return next(err);
  }
});



/** PATCH /[familyId] { fld1, fld2, ... } => { family }
 *
 * Patches family data.
 *
 * fields can be: {  }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:familyId", 
  ensureCorrectFamilyOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, familyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const family = await Family.update(req.params.familyId, req.body);
    return res.json({ family });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[familyId]/password { fld1, fld2, ... } => { family }
 *
 * Patches family password.
 *
 * fields can be: { password }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:familyId/password", 
  ensureCorrectFamilyOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, familyPasswordUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const family = await Family.updatePassword(req.params.familyId, req.body);
    return res.json({ family });
  } catch (err) {
    return next(err);
  }
});




/** DELETE /[familyId]  =>  { deleted: familyId }
 *
 * Authorization: admin or correct family
 */

router.delete("/:familyId", 
  ensureCorrectFamilyOrAdmin, 
  async function (req, res, next) {
  try {
    let deletedFamily = await Family.remove(req.params.familyId);
    return res.json({ deleted: deletedFamily.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;