"use strict";

/** Routes for members. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectMemberOrAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Member = require("../../models/members/member");

const memberNewSchema = require("../../schemas/members/memberNew.json");
const memberUpdateSchema = require("../../schemas/members/memberUpdate.json");
const router = new express.Router();

  
  /** GET /[id] => { member }
 *
 * 
 *
 * Authorization required: admin or :id is in res.locals.family.memberIds
 **/

  router.get("/:id", 
    ensureCorrectMemberOrAdmin, 
    async function (req, res, next) {
    try {
      const member = await Member.get(req.params.id);
      return res.json({ member });
    } catch (err) {
      return next(err);
    }
  });
  
/** GET /[id]/allergies => { allergies }
 *
 * Returns allergies: [{ id, member_id, name, reaction, notes }
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/allergies", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const allergies = await Member.getAllergies(req.params.id);
    return res.json({ allergies });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]/diagnoses => { diagnoses }
 *
 * Returns diagnoses: [{ id, member_id, }
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/diagnoses", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const diagnoses = await Member.getDiagnoses(req.params.id);
    return res.json({ diagnoses });
  } catch (err) {
    return next(err);
  }
});


/** GET /[id]/images => { images }
 *
 * Returns images: [{  }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/images", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const images = await Member.getImages(req.params.id);
    return res.json({ images });
  } catch (err) {
    return next(err);
  }
});


/** GET /[id]/doctors => { doctors }
 *
 * Returns doctors: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/doctors", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const doctors = await Member.getDoctors(req.params.id);
    return res.json({ doctors });
  } catch (err) {
    return next(err);
  }
});


/** GET /[id]/insurance => { insurance }
 *
 * Returns insurance: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/insurance", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const insurance = await Member.getInsurance(req.params.id);
    return res.json({ insurance });
  } catch (err) {
    return next(err);
  }
});


/** GET /[id]/meds => { meds }
 *
 * Returns meds: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/meds", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const meds = await Member.getMeds(req.params.id);
    return res.json({ meds });
  } catch (err) {
    return next(err);
  }
});


/** GET /[id]/symptoms => { symptoms }
 *
 * Returns symptoms: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/symptoms", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const symptoms = await Member.getSymptoms(req.params.id);
    return res.json({ symptoms });
  } catch (err) {
    return next(err);
  }
});


/** GET /[id]/visits => { visits }
 *
 * Returns visits: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/visits", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const visits = await Member.getVisits(req.params.id);
    return res.json({ visits });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]/goals => { goals }
 *
 * Returns goals: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/goals", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const goals = await Member.getGoals(req.params.id);
    return res.json({ goals });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id] { fld1, fld2, ... } => { member }
 *
 * Patches member data.
 *
 * fields can be: {  }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:id", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, memberUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    if((req.body.birthday.length === 0) && (typeof req.body.birthday === "string")){
      req.body.birthday = null;
    }
    const member = await Member.update(req.params.id, req.body);
    return res.json({ member });
  } catch (err) {
    return next(err);
  }
});



/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or member from correct family
 */

router.delete("/:id", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    let deletedMember = await Member.remove(req.params.id);
    return res.json({ deleted: deletedMember.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;