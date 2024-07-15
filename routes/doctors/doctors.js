"use strict";

/** Routes for doctors. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Doctor = require("../../models/doctors/doctor");
// const { createToken } = require("../../helpers/tokens");
const doctorNewSchema = require("../../schemas/doctors/doctorNew.json");
const doctorUpdateSchema = require("../../schemas/doctors/doctorUpdate.json");

const router = new express.Router();

/** POST / { doctor } =>  { doctor }
 *
 ** data should be { memberId, name, specialty, clinic, address, phone, notes }
   *
   * Returns { id, memberId, name, specialty, clinic, address, phone, notes }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, doctorNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    if(!req.body.clinic){
      req.body.clinic = null;
    }
    if(!req.body.address){
      req.body.address = null;
    }
    if(!req.body.phone){
      req.body.phone = null;
    }

    if(!req.body.notes){
      req.body.notes = null;
    }

    const doctor = await Doctor.create(req.body);
    return res.status(201).json({ doctor });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { doctors: [ {id, member_id, name, specialty, clinic, address, phone, notes }, ... ] }
 *
 * Returns list of all doctors.
 *
 * Authorization required: admin
 **/


router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const doctors = await Doctor.findAll();
      return res.json({ doctors });
    } catch (err) {
      return next(err);
    }
  });
  
/** GET /[id] => { doctor }
 *
 * Returns doctor: {  }
   * 
 * Authorization required: admin or same member_id in list of family_id members
 **/

router.get("/:id", 
    // ensureCorrectUserOrAdmin, 
    async function (req, res, next) {
    try {
      const doctor = await Doctor.get(req.params.id);
      return res.json({ doctor });
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
    await Doctor.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;