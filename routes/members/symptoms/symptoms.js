"use strict";

/** Routes for symptoms. */

const jsonschema = require("jsonschema");

const express = require("express");
const {ensureCorrectMemberOrAdmin } = require("../../../middleware/auth");
const { BadRequestError } = require("../../../expressError");
const Symptom = require("../../../models/symptoms/symptom");

const symptomNewSchema = require("../../../schemas/symptoms/symptomNew.json");
const symptomUpdateSchema = require("../../../schemas/symptoms/symptomUpdate.json");

const router = new express.Router();


/** POST /[id]/symptom  =>  { symptom }
 *
 *
  * data should be { name, startDate, endDate, notes }
  *
  * Returns { id, memberId, name, startDate, endDate, notes }
  *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/:id/symptoms", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, symptomNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    if(!req.body.startDate){
      req.body.startDate = null;
    }
    if(!req.body.endDate){
      req.body.endDate = null;
    }
    if(!req.body.notes){
      req.body.notes = null;
    }
    const memberId = +req.params.id;
    const symptom = await Symptom.create(req.body, memberId);

    return res.status(201).json({ symptom });
  } catch (err) {
    return next(err);
  }
});

  
/** GET /[id] => { symptoms }
 *
 * Returns symptoms: {  }
   * 
 * Authorization required: admin or same member_id in list of family_id members
 **/

// router.get("/:id", 
//     ensureCorrectMemberOrAdmin, 
//     async function (req, res, next) {
//     try {
//       const symptoms = await Symptom.get(req.params.id);
//       return res.json({ symptoms });
//     } catch (err) {
//       return next(err);
//     }
//   });


/** PATCH /[id] { fld1, fld2, ... } => { symptom }
 *
 * Patches symptom data.
 *
 * fields can be: {  }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:id/symptoms/:symptomId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, symptomUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const memberId = +req.params.id;
    const symptomId = +req.params.symptomId;
    const symptom = await Symptom.update(req.body, symptomId, memberId);
    return res.json({ symptom });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or correct user
 */

router.delete("/:id/symptoms/:symptomId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const symptomId = +req.params.symptomId;
    let deletedSymptom = await Symptom.remove(symptomId, memberId);
    return res.json({ deleted: deletedSymptom.id });
  } catch (err) {
    return next(err);
  }
});



module.exports = router;