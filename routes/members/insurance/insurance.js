"use strict";

/** Routes for symptoms. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectMemberOrAdmin } = require("../../../middleware/auth");
const { BadRequestError } = require("../../../expressError");
const Insurance = require("../../../models/insurance/insurance");
// const { createToken } = require("../../helpers/tokens");
const insuranceNewSchema = require("../../../schemas/insurance/insuranceNew.json");
const insuranceUpdateSchema = require("../../../schemas/insurance/insuranceUpdate.json");

const router = new express.Router();

/** POST /[id]/insurance { insurance } =>  { insurance }
 *
 *
  * data should be { memberId, name, dateReceived, notes}
  *
  * Returns { id, memberId, name, dateReceived, notes }
  *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/:id/insurance", 
  ensureCorrectMemberOrAdmin, 
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
    const memberId = +req.params.id;
    const insurance = await Insurance.create(req.body, memberId);
    return res.status(201).json({ insurance });
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

router.get("/:id/insurance/:insuranceId", 
    ensureCorrectMemberOrAdmin, 
    async function (req, res, next) {
    try {
      const memberId = +req.params.id;
      const insuranceId = +req.params.insuranceId;

      const insurance = await Insurance.get(insuranceId, memberId);
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

router.patch("/:id/insurance/:insuranceId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, insuranceUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    console.log(req.body.startDate);
      if((req.body.startDate.length === 0) && (typeof req.body.startDate === "string")){
        req.body.startDate = null;
      }
      if((req.body.endDate.length === 0) && (typeof req.body.endDate === "string")){
        req.body.endDate = null;
      }
    const memberId = +req.params.id;
    const insuranceId = +req.params.insuranceId;
    const insurance = await Insurance.update(req.body, insuranceId, memberId);
    return res.json({ insurance });
  } catch (err) {
    return next(err);
  }
});




/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or correct user
 */

router.delete("/:id/insurance/:insuranceId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const insuranceId = +req.params.insuranceId;

    let deletedInsurance = await Insurance.remove(insuranceId, memberId);
    return res.json({ deleted: deletedInsurance.id });
  } catch (err) {
    return next(err);
  }
});



module.exports = router;