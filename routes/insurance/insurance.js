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

/** POST / { insurance } =>  { insurance }
 *
 *
  * data should be { memberId, name, dateReceived, notes}
  *
  * Returns { id, memberId, name, dateReceived, notes }
  *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, insuranceNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    if(!req.body.insuredName){
      req.body.insuredName = null;
    }
    if(!req.body.startDate){
      req.body.startDate = null;
    }
    if(!req.body.endDate){
      req.body.endDate = null;
    }
    if(!req.body.groupNum){
      req.body.groupNum = null;
    }
    if(!req.body.contractNum){
      req.body.contractNum = null;
    }
    if(!req.body.frontImageId){
      req.body.frontImageId = null;
    }
    if(!req.body.backImageId){
      req.body.backImageId = null;
    }
    if(!req.body.notes){
      req.body.notes = null;
    }

    const insurance = await Insurance.create(req.body);
    return res.status(201).json({ insurance });
  } catch (err) {
    return next(err);
  }
});


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
  

/** PATCH /[id] { fld1, fld2, ... } => { insurance }
 *
 * Patches insurance data.
 *
 * fields can be: {  }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:id", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, insuranceUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const insurance = await Insurance.update(req.params.id, req.body);
    return res.json({ insurance });
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
    await Insurance.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});



module.exports = router;