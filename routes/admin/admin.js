"use strict";

/** Routes for admins. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const { createToken } = require("../../helpers/tokens");

//import all models
const Allergy = require("../../models/allergies/allergy");
const Diagnosis = require("../../models/diagnoses/diagnosis");
const Doctor = require("../../models/doctors/doctor");
const Family = require("../../models/families/family");
const Goal = require("../../models/goals/goal");
const Image = require("../../models/images/image");
const Insurance = require("../../models/insurance/insurance");
const Med = require("../../models/meds/med");
const Member = require("../../models/members/member");
const Symptom = require("../../models/symptoms/symptom");
const Visit = require("../../models/visits/visit");

const familyNewSchema = require("../../schemas/families/familyNew.json");

const router = new express.Router();

/** POST /families { family } => { family, token }
 *
 * Adds a new family. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users/families. The new user being added can be an
 * admin.
 *
 * This returns the newly created user/family and an authentication token for them:
 *  {family: { id, email, name, isAdmin }, token }
 *
 * Authorization required: admin
 * 
 * family must include { email, password, name, isAdmin }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: admin
 */

router.post("/families", 
    ensureAdmin,
    async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, familyNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const newFamily = await Family.register(req.body);
      const token = createToken(newFamily);
      return res.status(201).json({ newFamily, token });
    } catch (err) {
      return next(err);
    }
  });


/** GET / => { allergies: [ {id, member_id, name, reaction, notes }, ... ] }
 *
 * Returns list of all allergies.
 *
 * Authorization required: admin
 **/

router.get("/allergies", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const allergies = await Allergy.findAll();
      return res.json({ allergies });
    } catch (err) {
      return next(err);
    }
  });
  
/** GET /diagnoses => { diagnoses: [ {id, member_id, name, date_received, notes }, ... ] }
 *
 * Returns list of all diagnoses.
 *
 * Authorization required: admin
 **/


router.get("/diagnoses", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const diagnoses = await Diagnosis.findAll();
      return res.json({ diagnoses });
    } catch (err) {
      return next(err);
    }
  });
  
/** GET /doctors => { doctors: [ {id, member_id, name, specialty, clinic, address, phone, notes }, ... ] }
 *
 * Returns list of all doctors.
 *
 * Authorization required: admin
 **/


router.get("/doctors", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const doctors = await Doctor.findAll();
      return res.json({ doctors });
    } catch (err) {
      return next(err);
    }
  });

/** GET /families => { families: [ {email, name, isAdmin}, ... ] }
 *
 * Returns list of all families.
 *
 * Authorization required: admin
 **/

router.get("/families", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const families = await Family.findAll();
      return res.json({ families });
    } catch (err) {
      return next(err);
    }
  });

/** GET /goals => { goals: [ {id, member_id, goal_name, goal_details }, ... ] }
 *
 * Returns list of all goals.
 *
 * Authorization required: admin
 **/


router.get("/goals", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const goals = await Goal.findAll();
      return res.json({ goals });
    } catch (err) {
      return next(err);
    }
  });

/** GET /images => { images: [ {id, member_id, path }, ... ] }
 *
 * Returns list of all images.
 *
 * Authorization required: admin
 **/


router.get("/images", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const images = await Image.findAll();
      return res.json({ images });
    } catch (err) {
      return next(err);
    }
  });

/** GET /insurance => { insurance: [ {id, member_id, type, company_name, insured_name, start_date, end_date, group_num, contract_num, notes, front_image_id, back_image_id }, ... ] }
 *
 * Returns list of all insurance.
 *
 * Authorization required: admin
 **/


router.get("/insurance", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const insurance = await Insurance.findAll();
      return res.json({ insurance });
    } catch (err) {
      return next(err);
    }
  });

/** GET /meds => { meds: [ {id, member_id, prescriber_id, name, start_date, end_date, indication, dose, notes }, ... ] }
 *
 * Returns list of all meds.
 *
 * Authorization required: admin
 **/


router.get("/meds", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const meds = await Med.findAll();
      return res.json({ meds });
    } catch (err) {
      return next(err);
    }
  });


  /** GET /members => { members: [ {id, firstName, lastName, email }, ... ] }
 *
 * Returns list of all members.
 *
 * Authorization required: admin
 **/

router.get("/members", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const members = await Member.findAll();
      return res.json({ members });
    } catch (err) {
      return next(err);
    }
  });

/** GET /symptoms => { symptoms: [ {id, member_id, name, start_date, end_date, notes }, ... ] }
 *
 * Returns list of all symptoms.
 *
 * Authorization required: admin
 **/


router.get("/symptoms", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const symptoms = await Symptom.findAll();
      return res.json({ symptoms });
    } catch (err) {
      return next(err);
    }
  });

/** GET /visits => { visits: [ {id, member_id, doctor_id, title, date, description }, ... ] }
 *
 * Returns list of all visits.
 *
 * Authorization required: admin
 **/


router.get("/visits", 
    ensureAdmin, 
    async function (req, res, next) {
    try {
      const visits = await Visit.findAll();
      return res.json({ visits });
    } catch (err) {
      return next(err);
    }
  });


module.exports = router;