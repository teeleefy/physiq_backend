"use strict";

/** Routes for meds. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Med = require("../../models/meds/med");
// const { createToken } = require("../../helpers/tokens");
const medNewSchema = require("../../schemas/meds/medNew.json");
const medUpdateSchema = require("../../schemas/meds/medUpdate.json");

const router = new express.Router();

/** POST / { insurance } =>  { insurance }
 *
 * data should be {  memberId, prescriberId, name, startDate, endDate, indication, dose, notes }
   *
   * Returns { id, memberId, prescriberId, name, startDate, endDate, indication, dose, notes }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, medNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    if(!req.body.prescriberId){
      req.body.prescriberId = null;
    }
    if(!req.body.startDate){
      req.body.startDate = null;
    }
    if(!req.body.endDate){
      req.body.endDate = null;
    }
    if(!req.body.indication){
      req.body.indication = null;
    }
    if(!req.body.dose){
      req.body.dose = null;
    }
    if(!req.body.notes){
      req.body.notes = null;
    }

    const med = await Med.create(req.body);
    return res.status(201).json({ med });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { meds: [ {id, member_id, prescriber_id, name, start_date, end_date, indication, dose, notes }, ... ] }
 *
 * Returns list of all meds.
 *
 * Authorization required: admin
 **/


router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const meds = await Med.findAll();
      return res.json({ meds });
    } catch (err) {
      return next(err);
    }
  });
  
/** GET /[id] => { meds }
 *
 * Returns meds: {  }
   * 
 * Authorization required: admin or same member_id in list of family_id members
 **/

router.get("/:id", 
    // ensureCorrectUserOrAdmin, 
    async function (req, res, next) {
    try {
      const meds = await Med.get(req.params.id);
      return res.json({ meds });
    } catch (err) {
      return next(err);
    }
  });
  








module.exports = router;