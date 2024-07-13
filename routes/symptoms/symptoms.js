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








module.exports = router;