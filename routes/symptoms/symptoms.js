"use strict";

/** Routes for symptoms. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Symptom = require("../../models/symptoms/symptom");
// const { createToken } = require("../../helpers/tokens");
const symptomNewSchema = require("../../schemas/symptoms/symptomNew.json");
const symptomUpdateSchema = require("../../schemas/symptoms/symptomUpdate.json");

const router = new express.Router();


/** POST / { symptom } =>  { symptom }
 *
 *
  * data should be { memberId, name, startDate, endDate, notes }
  *
  * Returns { id, memberId, name, startDate, endDate, notes }
  *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/", 
  // ensureCorrectUserOrAdmin, 
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
    
    const symptom = await Symptom.create(req.body);

    return res.status(201).json({ symptom });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { symptoms: [ {id, member_id, name, start_date, end_date, notes }, ... ] }
 *
 * Returns list of all symptoms.
 *
 * Authorization required: admin
 **/


router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const symptoms = await Symptom.findAll();
      return res.json({ symptoms });
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

router.get("/:id", 
    // ensureCorrectUserOrAdmin, 
    async function (req, res, next) {
    try {
      const symptoms = await Symptom.get(req.params.id);
      return res.json({ symptoms });
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
    await Symptom.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});



module.exports = router;