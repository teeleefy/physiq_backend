"use strict";

const db = require("../../db");

// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for images table. */

class Image {

  /** Find all images.
   *
   * Returns [{ id, member_id, path}, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  path
           FROM images
           ORDER BY member_id`,
    );
   
    return result.rows;
  }

  /** Given an id, return data about a member.
   *
   * Returns { id, member_id, path}
   *
   * Throws NotFoundError if image not found.
   **/

  static async get(id) {
    const result = await db.query(
          `SELECT id,
                  member_id,
                  path
           FROM images
           WHERE id = $1`,
        [id],
    );

    const image = result.rows[0];

    if (!image) throw new NotFoundError(`No image: ${id}`);

    return image;
  }

 

}


module.exports = Image;
