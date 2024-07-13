"use strict";

/** Routes for meds. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Med = require("../../models/meds/med");
// const { createToken } = require("../../helpers/tokens");
const medNewSchema = require("../../schemas/meds/medNew.json");
const medUpdateSchema = require("../../schemas/meds/medUpdate.json");

const router = new express.Router();

/** GET / => { meds: [ {id, member_id, prescriber_id, name, start_date, end_date, indication, dose, notes }, ... ] }
 *
 * Returns list of all meds.
 *
 * Authorization required: admin
 **/


router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const meds = await Med.findAll();
      return res.json({ meds });
    } catch (err) {
      return next(err);
    }
  });
  
/** GET /[id] => { meds }
 *
 * Returns meds: {  }
   * 
 * Authorization required: admin or same member_id in list of family_id members
 **/

router.get("/:id", 
    // ensureCorrectUserOrAdmin, 
    async function (req, res, next) {
    try {
      const meds = await Med.get(req.params.id);
      return res.json({ meds });
    } catch (err) {
      return next(err);
    }
  });
  








module.exports = router;