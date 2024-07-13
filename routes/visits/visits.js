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