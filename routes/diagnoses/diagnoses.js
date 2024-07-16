"use strict";

/** Routes for diagnoses. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Diagnosis = require("../../models/diagnoses/diagnosis");
// const { createToken } = require("../../helpers/tokens");
const diagnosisNewSchema = require("../../schemas/diagnoses/diagnosisNew.json");
const diagnosisUpdateSchema = require("../../schemas/diagnoses/diagnosisUpdate.json");

const router = new express.Router();


/** POST / { diagnosis } =>  { diagnosis }
 *
 *
  * data should be { memberId, name, dateReceived, notes}
  *
  * Returns { id, memberId, name, dateReceived, notes }
  *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/", 
  // ensureCorrectUserOrAdmin, 
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

    const diagnosis = await Diagnosis.create(req.body);
    return res.status(201).json({ diagnosis });
  } catch (err) {
    return next(err);
  }
});



/** GET / => { diagnoses: [ {id, member_id, name, date_received, notes }, ... ] }
 *
 * Returns list of all diagnoses.
 *
 * Authorization required: admin
 **/


router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const diagnoses = await Diagnosis.findAll();
      return res.json({ diagnoses });
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

router.get("/:id", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const diagnosis = await Diagnosis.get(req.params.id);
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

router.patch("/:id", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, diagnosisUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const diagnosis = await Diagnosis.update(req.params.id, req.body);
    return res.json({ diagnosis });
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
    await Diagnosis.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});




module.exports = router;