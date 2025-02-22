"use strict";

/** Routes for diagnoses. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectMemberOrAdmin } = require("../../../middleware/auth");
const { BadRequestError } = require("../../../expressError");
const Diagnosis = require("../../../models/diagnoses/diagnosis");

const diagnosisNewSchema = require("../../../schemas/diagnoses/diagnosisNew.json");
const diagnosisUpdateSchema = require("../../../schemas/diagnoses/diagnosisUpdate.json");

const router = new express.Router();


/** POST /:id/diagnoses/ { diagnosis } =>  { diagnosis }
 *
 *
  * data should be { memberId, name, dateReceived, notes}
  *
  * Returns { id, memberId, name, dateReceived, notes }
  *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/:id/diagnoses", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, diagnosisNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    if(!req.body.dateReceived){
      req.body.dateReceived = null;
    }

    if(!req.body.notes){
      req.body.notes = null;
    }
    const memberId = +req.params.id;
    const diagnosis = await Diagnosis.create(req.body, memberId);
    return res.status(201).json({ diagnosis });
  } catch (err) {
    return next(err);
  }
});
  
/** GET /[id] => { diagnosis }
 *
 * Returns diagnosis: {  }
   * 
 * Authorization required: admin or same member_id in list of family_id members
 **/

router.get("/:id/diagnoses/:diagnosisId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const diagnosisId = +req.params.diagnosisId;

    const diagnosis = await Diagnosis.get(diagnosisId, memberId);
    return res.json({ diagnosis });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id] { fld1, fld2, ... } => { diagnosis }
 *
 * Patches diagnosis data.
 *
 * fields can be: {  }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:id/diagnoses/:diagnosisId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, diagnosisUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    if((req.body.dateReceived.length === 0) && (typeof req.body.dateReceived === "string")){
      req.body.dateReceived = null;
    }
    
    const memberId = +req.params.id;
    const diagnosisId = +req.params.diagnosisId;

    const diagnosis = await Diagnosis.update(req.body, diagnosisId, memberId);
    return res.json({ diagnosis });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or correct user
 */

router.delete("/:id/diagnoses/:diagnosisId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const diagnosisId = +req.params.diagnosisId;

    let deletedDiagnosis = await Diagnosis.remove(diagnosisId, memberId);
    return res.json({ deleted: deletedDiagnosis.id });
  } catch (err) {
    return next(err);
  }
});




module.exports = router;