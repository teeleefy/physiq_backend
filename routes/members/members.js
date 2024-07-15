"use strict";

/** Routes for members. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Member = require("../../models/members/member");
// const { createToken } = require("../../helpers/tokens");
const memberNewSchema = require("../../schemas/members/memberNew.json");
const memberUpdateSchema = require("../../schemas/members/memberUpdate.json");

const router = new express.Router();



/** POST / { member } =>  { member }
 *
 *
   * data should be { familyId, firstName, lastName, birthday }
   *
   * Returns { id, familyId, firstName, lastName, birthday }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, memberNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    if(!req.body.birthday){
      req.body.birthday = null;
    }

    const member = await Member.create(req.body);
    return res.status(201).json({ member });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { members: [ {id, firstName, lastName, email }, ... ] }
 *
 * Returns list of all members.
 *
 * Authorization required: admin
 **/

router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const members = await Member.findAll();
      return res.json({ members });
    } catch (err) {
      return next(err);
    }
  });
  
  /** GET /[id] => { member }
 *
 * 
 *
 * Authorization required: admin or same  family id-as-:id
 **/

  router.get("/:id", 
    // ensureCorrectUserOrAdmin, 
    async function (req, res, next) {
    try {
      const member = await Member.get(req.params.id);
      return res.json({ member });
    } catch (err) {
      return next(err);
    }
  });
  
/** GET /[member_id] => { allergies }
 *
 * Returns allergies: [{ id, member_id, name, reaction, notes }
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/allergies", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const allergies = await Member.getAllergies(req.params.id);
    return res.json({ allergies });
  } catch (err) {
    return next(err);
  }
});

/** GET /[member_id] => { diagnoses }
 *
 * Returns diagnoses: [{ id, member_id, }
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/diagnoses", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const diagnoses = await Member.getDiagnoses(req.params.id);
    return res.json({ diagnoses });
  } catch (err) {
    return next(err);
  }
});


/** GET /[member_id] => { images }
 *
 * Returns images: [{  }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/images", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const images = await Member.getImages(req.params.id);
    return res.json({ images });
  } catch (err) {
    return next(err);
  }
});


/** GET /[member_id] => { doctors }
 *
 * Returns doctors: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/doctors", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const doctors = await Member.getDoctors(req.params.id);
    return res.json({ doctors });
  } catch (err) {
    return next(err);
  }
});


/** GET /[member_id] => { insurance }
 *
 * Returns insurance: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/insurance", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const insurance = await Member.getInsurance(req.params.id);
    return res.json({ insurance });
  } catch (err) {
    return next(err);
  }
});


/** GET /[member_id] => { meds }
 *
 * Returns meds: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/meds", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const meds = await Member.getMeds(req.params.id);
    return res.json({ meds });
  } catch (err) {
    return next(err);
  }
});


/** GET /[member_id] => { symptoms }
 *
 * Returns symptoms: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/symptoms", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const symptoms = await Member.getSymptoms(req.params.id);
    return res.json({ symptoms });
  } catch (err) {
    return next(err);
  }
});


/** GET /[member_id] => { visits }
 *
 * Returns visits: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/visits", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const visits = await Member.getVisits(req.params.id);
    return res.json({ visits });
  } catch (err) {
    return next(err);
  }
});

/** GET /[member_id] => { goals }
 *
 * Returns goals: [{ }]
   * 
 * Authorization required: admin or same family_id
 **/

router.get("/:id/goals", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const goals = await Member.getGoals(req.params.id);
    return res.json({ goals });
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
    await Member.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;