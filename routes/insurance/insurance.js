"use strict";

/** Routes for symptoms. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Insurance = require("../../models/insurance/insurance");
// const { createToken } = require("../../helpers/tokens");
const insuranceNewSchema = require("../../schemas/insurance/insuranceNew.json");
const insuranceUpdateSchema = require("../../schemas/insurance/insuranceUpdate.json");

const router = new express.Router();

/** GET / => { insurance: [ {id, member_id, type, company_name, insured_name, start_date, end_date, group_num, contract_num, notes, front_image_id, back_image_id }, ... ] }
 *
 * Returns list of all insurance.
 *
 * Authorization required: admin
 **/


router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const insurance = await Insurance.findAll();
      return res.json({ insurance });
    } catch (err) {
      return next(err);
    }
  });
  
/** GET /[id] => { insurance }
 *
 * Returns insurance: {  }
   * 
 * Authorization required: admin or same member_id in list of family_id members
 **/

router.get("/:id", 
    // ensureCorrectUserOrAdmin, 
    async function (req, res, next) {
    try {
      const insurance = await Insurance.get(req.params.id);
      return res.json({ insurance });
    } catch (err) {
      return next(err);
    }
  });
  









module.exports = router;