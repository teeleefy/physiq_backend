"use strict";

/** Routes for images. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectMemberOrAdmin } = require("../../../middleware/auth");
const { BadRequestError } = require("../../../expressError");
const Goal = require("../../../models/goals/goal");

const goalNewSchema = require("../../../schemas/goals/goalNew.json");
const goalUpdateSchema = require("../../../schemas/goals/goalUpdate.json");

const router = new express.Router();

/** POST /members/[id]/goals { goal } =>  { goal }
 *
 *
   * data should be { goalName, goalDetails }
   *
   * Returns { id, memberId, goalName, goalDetails }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/:id/goals", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, goalNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    if(!req.body.goalDetails){
      req.body.goalDetails = null;
    }
    const memberId = +req.params.id;
    const goal = await Goal.create(req.body, memberId);
    return res.status(201).json({ goal });
  } catch (err) {
    return next(err);
  }
});

  
 /** GET /[id] => { goal }
 *
 * Returns { }
 *
 * Authorization required: admin or same  family id-as-:id
 **/

 router.get("/:id/goals/:goalId", 
    ensureCorrectMemberOrAdmin, 
    async function (req, res, next) {
    try {
      const memberId = +req.params.id;
      const goalId = +req.params.goalId;


      const goal = await Goal.get(goalId, memberId);
      return res.json({ goal });
    } catch (err) {
      return next(err);
    }
  });
  
/** PATCH /[id] { fld1, fld2, ... } => { goal }
 *
 * Patches goal data.
 *
 * fields can be: {  }
 *
 * Returns { id,  }
 *
 * Authorization required: admin or correct user
 */

router.patch("/:id/goals/:goalId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, goalUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const memberId = +req.params.id;
    const goalId = +req.params.goalId;

    const goal = await Goal.update(req.body, goalId, memberId);
    return res.json({ goal });
  } catch (err) {
    return next(err);
  }
});



/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or correct user
 */

router.delete("/:id/goals/:goalId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const goalId = +req.params.goalId;

    let deletedGoal = await Goal.remove(goalId, memberId);
    return res.json({ deleted: deletedGoal.id });
  } catch (err) {
    return next(err);
  }
});

  module.exports = router;