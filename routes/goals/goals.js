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
  


  module.exports = router;