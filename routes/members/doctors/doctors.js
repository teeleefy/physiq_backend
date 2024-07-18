"use strict";

/** Routes for doctors. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectMemberOrAdmin } = require("../../../middleware/auth");
const { BadRequestError } = require("../../../expressError");
const Doctor = require("../../../models/doctors/doctor");

const doctorNewSchema = require("../../../schemas/doctors/doctorNew.json");
const doctorUpdateSchema = require("../../../schemas/doctors/doctorUpdate.json");

const router = new express.Router();

/** POST /[id]/doctors { doctor } =>  { doctor }
 *
 ** data should be { name, specialty, clinic, address, phone, notes }
   *
   * Returns { id, memberId, name, specialty, clinic, address, phone, notes }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/:id/doctors", 
  ensureCorrectMemberOrAdmin, 
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


    const memberId = +req.params.id;

    const doctor = await Doctor.create(req.body, memberId);
    return res.status(201).json({ doctor });
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

// router.get("/:id", 
//     // ensureCorrectUserOrAdmin, 
//     async function (req, res, next) {
//     try {
//       const doctor = await Doctor.get(req.params.id);
//       return res.json({ doctor });
//     } catch (err) {
//       return next(err);
//     }
//   });

/** PATCH /[id] { fld1, fld2, ... } => { doctor }
 *
 * Patches doctor data.
 *
 * fields can be: {  }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:id/doctors/:doctorId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, doctorUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const memberId = +req.params.id;
    const doctorId = +req.params.doctorId;

    const doctor = await Doctor.update(req.body, doctorId, memberId);
    return res.json({ doctor });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or correct user
 */

router.delete("/:id/doctors/:doctorId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const doctorId = +req.params.doctorId;

    let deletedDoctor = await Doctor.remove(doctorId, memberId);
    return res.json({ deleted: deletedDoctor.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;