"use strict";

/** Routes for allergies. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectMemberOrAdmin } = require("../../../middleware/auth");
const { BadRequestError } = require("../../../expressError");
const Allergy = require("../../../models/allergies/allergy");

const allergyNewSchema = require("../../../schemas/allergies/allergyNew.json");
const allergyUpdateSchema = require("../../../schemas/allergies/allergyUpdate.json");

const router = new express.Router();

/** POST /[id]/allergies/[allergyId] { allergy } =>  { allergy }
 *
 *
   * data should be { name, reaction, notes }
   *
   * Returns { id, memberId, name, reaction, notes }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/:id/allergies", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, allergyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    if(!req.body.notes){
      req.body.notes = null;
    }

    const memberId = +req.params.id;

    const allergy = await Allergy.create(req.body, memberId);
    return res.status(201).json({ allergy });
  } catch (err) {
    return next(err);
  }
});
  

/** GET /:id/allergies/:allergyId => { allergy }
 *
 * Returns allergy: [{ id, member_id, name, reaction, notes }
   * 
 * Authorization required: admin or same member_id in list of family_id members
 **/

router.get("/:id/allergies/:allergyId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const allergyId = +req.params.allergyId;

    const allergy = await Allergy.get(allergyId, memberId);
    return res.json({ allergy });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id] { fld1, fld2, ... } => { allergy }
 *
 * Patches allergy data.
 *
 * fields can be: {  }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:id/allergies/:allergyId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, allergyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const memberId = +req.params.id;
    const allergyId = +req.params.allergyId;

    const allergy = await Allergy.update(req.body, allergyId, memberId);
    return res.json({ allergy });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]/allergies/:allergyId  =>  { deleted: id }
 *
 * Authorization: admin or correct user
 */

router.delete("/:id/allergies/:allergyId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const allergyId = +req.params.allergyId;
    let deletedAllergy = await Allergy.remove(allergyId, memberId);
    return res.json({ deleted: deletedAllergy.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;