"use strict";

/** Routes for meds. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectMemberOrAdmin } = require("../../../middleware/auth");
const { BadRequestError } = require("../../../expressError");
const Med = require("../../../models/meds/med");

const medNewSchema = require("../../../schemas/meds/medNew.json");
const medUpdateSchema = require("../../../schemas/meds/medUpdate.json");

const router = new express.Router();

/** POST /[id]/meds  =>  { med }
 *
 * data should be {  prescriberId, name, startDate, endDate, indication, dose, notes }
   *
   * Returns { id, memberId, prescriberId, name, startDate, endDate, indication, dose, notes }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/:id/meds", 
  ensureCorrectMemberOrAdmin, 
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
    const memberId = +req.params.id;
    const med = await Med.create(req.body, memberId);
    return res.status(201).json({ med });
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

router.get("/:id/meds/:medId", 
    ensureCorrectMemberOrAdmin, 
    async function (req, res, next) {
    try {
      const memberId = +req.params.id;
      const medId = +req.params.medId;

      const med = await Med.get(medId, memberId);
      return res.json({ med });
    } catch (err) {
      return next(err);
    }
  });
  


/** PATCH /[id] { fld1, fld2, ... } => { med }
 *
 * Patches med data.
 *
 * fields can be: {  }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:id/meds/:medId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, medUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
  
    if((req.body.startDate.length === 0) && (typeof req.body.startDate === "string")){
      req.body.startDate = null;
    }
    if((req.body.endDate.length === 0) && (typeof req.body.endDate === "string")){
      req.body.endDate = null;
    }

    if(req.body.prescriberId === "-1" || req.body.prescriberId === -1){
      req.body.prescriberId = null;
    }
    const memberId = +req.params.id;
    const medId = +req.params.medId;
    const med = await Med.update(req.body, medId, memberId);
    return res.json({ med });
  } catch (err) {
    return next(err);
  }
});



/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or correct user
 */

router.delete("/:id/meds/:medId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const medId = +req.params.medId;

    let deletedMed = await Med.remove(medId, memberId);
    return res.json({ deleted: deletedMed.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;