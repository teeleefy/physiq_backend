"use strict";

/** Routes for diagnoses. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectMemberOrAdmin } = require("../../../middleware/auth");
const { BadRequestError } = require("../../../expressError");
const Visit = require("../../../models/visits/visit");

const visitNewSchema = require("../../../schemas/visits/visitNew.json");
const visitUpdateSchema = require("../../../schemas/visits/visitUpdate.json");

const router = new express.Router();

/** POST /[id]/visit  =>  { visit }
 *
 *
  * data should be { doctorId, title, date, description }
  *
  * Returns { id, memberId, doctorId, title, date, description }
  *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/:id/visits", 
  ensureCorrectMemberOrAdmin, 
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
    const memberId = +req.params.id;
    const visit = await Visit.create(req.body, memberId);

    return res.status(201).json({ visit });
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

router.get("/:id/visits/:visitId", 
    ensureCorrectMemberOrAdmin, 
    async function (req, res, next) {
    try {
      const memberId = +req.params.id;
      const visitId = +req.params.visitId;
      const visit = await Visit.get(visitId, memberId);
      return res.json({ visit });
    } catch (err) {
      return next(err);
    }
  });
  
  

/** PATCH /[id] { fld1, fld2, ... } => { visit }
 *
 * Patches visit data.
 *
 * fields can be: {  }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:id/visits/:visitId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, visitUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    if((req.body.date.length === 0) && (typeof req.body.date === "string")){
      req.body.date = null;
    }
    if(req.body.doctorId === "-1"){
      req.body.doctorId = null;
    }
    const memberId = +req.params.id;
    const visitId = +req.params.visitId;
    const visit = await Visit.update(req.body, visitId, memberId);
    return res.json({ visit });
  } catch (err) {
    return next(err);
  }
});




/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or correct user
 */

router.delete("/:id/visits/:visitId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const visitId = +req.params.visitId;
    let deletedVisit = await Visit.remove(visitId, memberId);
    return res.json({ deleted: deletedVisit.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;