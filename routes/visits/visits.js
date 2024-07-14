"use strict";

/** Routes for diagnoses. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Visit = require("../../models/visits/visit");
// const { createToken } = require("../../helpers/tokens");
const visitNewSchema = require("../../schemas/visits/visitNew.json");
const visitUpdateSchema = require("../../schemas/visits/visitUpdate.json");

const router = new express.Router();

/** POST / { visit } =>  { visit }
 *
 *
  * data should be { memberId, doctorId, title, date, description }
  *
  * Returns { id, memberId, doctorId, title, date, description }
  *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, visitNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    if(!req.body.doctorId){
      req.body.doctorId = null;
    }
    if(!req.body.date){
      req.body.date = null;
    }
    if(!req.body.description){
      req.body.description = null;
    }
    
    const visit = await Visit.create(req.body);

    return res.status(201).json({ visit });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { visits: [ {id, member_id, doctor_id, title, date, description }, ... ] }
 *
 * Returns list of all visits.
 *
 * Authorization required: admin
 **/


router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const visits = await Visit.findAll();
      return res.json({ visits });
    } catch (err) {
      return next(err);
    }
  });
  
/** GET /[id] => { visit }
 *
 * Returns visit: {  }
   * 
 * Authorization required: admin or same member_id in list of family_id members
 **/

router.get("/:id", 
    // ensureCorrectUserOrAdmin, 
    async function (req, res, next) {
    try {
      const visit = await Visit.get(req.params.id);
      return res.json({ visit });
    } catch (err) {
      return next(err);
    }
  });
  
  








module.exports = router;