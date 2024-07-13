"use strict";

/** Routes for allergies. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Allergy = require("../../models/allergies/allergy");
// const { createToken } = require("../../helpers/tokens");
const allergyNewSchema = require("../../schemas/allergies/allergyNew.json");
const allergyUpdateSchema = require("../../schemas/allergies/allergyUpdate.json");

const router = new express.Router();

/** POST / { allergy } =>  { allergy }
 *
 *
   * data should be { memberId, name, reaction, notes }
   *
   * Returns { id, memberId, name, reaction, notes }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/", 
  // ensureCorrectUserOrAdmin, 
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

    const allergy = await Allergy.create(req.body);
    return res.status(201).json({ allergy });
  } catch (err) {
    return next(err);
  }
});



/** GET / => { allergies: [ {id, member_id, name, reaction, notes }, ... ] }
 *
 * Returns list of all allergies.
 *
 * Authorization required: admin
 **/


router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const allergies = await Allergy.findAll();
      return res.json({ allergies });
    } catch (err) {
      return next(err);
    }
  });
  
/** GET /[id] => { allergy }
 *
 * Returns allergy: [{ id, member_id, name, reaction, notes }
   * 
 * Authorization required: admin or same member_id in list of family_id members
 **/

router.get("/:id", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const allergy = await Allergy.get(req.params.id);
    return res.json({ allergy });
  } catch (err) {
    return next(err);
  }
});










module.exports = router;