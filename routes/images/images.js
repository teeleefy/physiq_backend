"use strict";

/** Routes for images. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth");
const { BadRequestError } = require("../../expressError");
const Image = require("../../models/images/image");
// const { createToken } = require("../../helpers/tokens");
const imageNewSchema = require("../../schemas/images/imageNew.json");
const imageUpdateSchema = require("../../schemas/images/imageUpdate.json");

const router = new express.Router();

/** GET / => { images: [ {id, member_id, path }, ... ] }
 *
 * Returns list of all images.
 *
 * Authorization required: admin
 **/


router.get("/", 
    // ensureAdmin, 
    async function (req, res, next) {
    try {
      const images = await Image.findAll();
      return res.json({ images });
    } catch (err) {
      return next(err);
    }
  });
  
 /** GET /[id] => { image }
 *
 * Returns { }
 *
 * Authorization required: admin or same  family id-as-:id
 **/

 router.get("/:id", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const image = await Image.get(req.params.id);
    return res.json({ image });
  } catch (err) {
    return next(err);
  }
});








module.exports = router;