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

/** POST / { image } =>  { image }
 *
 *
   * data should be { memberId, path }
   *
   * Returns { id, memberId, path }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/", 
  // ensureCorrectUserOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, imageNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const image = await Image.create(req.body);
    return res.status(201).json({ image });
  } catch (err) {
    return next(err);
  }
});


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


/** PATCH /[id] { fld1, fld2, ... } => { image }
 *
 * Patches image data.
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
    const validator = jsonschema.validate(req.body, imageUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const image = await Image.update(req.params.id, req.body);
    return res.json({ image });
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
    await Image.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;