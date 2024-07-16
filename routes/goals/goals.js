"use strict";

/** Routes for images. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Goal = require("../../models/goals/goal");
// const { createToken } = require("../../helpers/tokens");
const goalNewSchema = require("../../schemas/goals/goalNew.json");
const goalUpdateSchema = require("../../schemas/goals/goalUpdate.json");

const router = new express.Router();

/** POST / { goal } =>  { goal }
 *
 *
   * data should be { memberId, goalName, goalDetails }
   *
   * Returns { id, memberId, goalName, goalDetails }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/", 
  // ensureCorrectUserOrAdmin, 
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

    const goal = await Goal.create(req.body);
    return res.status(201).json({ goal });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { goals: [ {id, member_id, goal_name, goal_details }, ... ] }
 *
 * Returns list of all goals.
 *
 * Authorization required: admin
 **/


router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const goals = await Goal.findAll();
      return res.json({ goals });
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

 router.get("/:id", 
    // ensureCorrectUserOrAdmin, 
    async function (req, res, next) {
    try {
      const goal = await Goal.get(req.params.id);
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

router.patch("/:id", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, goalUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const goal = await Goal.update(req.params.id, req.body);
    return res.json({ goal });
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
    await Goal.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

  module.exports = router;