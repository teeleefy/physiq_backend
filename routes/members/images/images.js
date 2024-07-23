"use strict";

/** Routes for images. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectMemberOrAdmin } = require("../../../middleware/auth");
const { BadRequestError } = require("../../../expressError");
const Image = require("../../../models/images/image");
// const { createToken } = require("../../helpers/tokens");
const imageNewSchema = require("../../../schemas/images/imageNew.json");
const imageUpdateSchema = require("../../../schemas/images/imageUpdate.json");

const router = new express.Router();

/** POST /[id]/images { image } =>  { image }
 *
 *
   * data should be { path }
   *
   * Returns { id, memberId, path }
   *
 *
 * Authorization required: admin or correct family id user
 */

router.post("/:id/images", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, imageNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const memberId = +req.params.id;
    const image = await Image.create(req.body, memberId);
    return res.status(201).json({ image });
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

 router.get("/:id/images/:imageId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const imageId = +req.params.imageId;

    const image = await Image.get(imageId, memberId);
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

router.patch("/:id/images/:imageId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, imageUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const memberId = +req.params.id;
    const imageId = +req.params.imageId;

    const image = await Image.update(req.body, imageId, memberId);
    return res.json({ image });
  } catch (err) {
    return next(err);
  }
});



/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or correct user
 */

router.delete("/:id/images/:imageId", 
  ensureCorrectMemberOrAdmin, 
  async function (req, res, next) {
  try {
    const memberId = +req.params.id;
    const imageId = +req.params.imageId;

    let deletedImage = await Image.remove(imageId, memberId);
    return res.json({ deleted: deletedImage.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;