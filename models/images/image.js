"use strict";

const db = require("../../db");
const { sqlForPartialUpdate } = require("../../helpers/sql");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for images table. */

class Image {

 /** Create a image (from data), update db, return new image data.
   *
   *
   * data should be { memberId, path}
   *
   * Returns { id, memberId, path }
   *
   *
   * */
 static async create({ memberId, path }) {
  const memberIdCheck = await db.query(
    `SELECT id, 
      first_name AS "firstName"
     FROM family_members
     WHERE id = $1`,
  [memberId]);

if (!memberIdCheck.rows[0])
throw new BadRequestError(`No existing member: ${memberId}`);


  const result = await db.query(
        `INSERT INTO images
          (member_id, path)
         VALUES ($1, $2)
         RETURNING id, member_id AS "memberId", path`,
      [
        memberId, 
        path
      ],
  );

  const image = result.rows[0];

  return image;
}


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

/** Update image data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { path }
   *
   * Returns { id, memberId, path }
   *
   * Throws NotFoundError if not found.
   */

static async update(id, data) {
  const { setColumns, values } = sqlForPartialUpdate(data, {});

  /*'id' will be added to the end of the values and passed into the end of the db query as an array, 
  so the index of 'id' will be the length of values plus one*/
  const idVarIdx = "$" + (values.length + 1);

  const sqlQuery = `UPDATE images
                    SET ${setColumns} 
                    WHERE id = ${idVarIdx} 
                    RETURNING id,
                              member_id AS "memberId",
                              path`;
  
  const result = await db.query(sqlQuery, [...values, id]);
  const image = result.rows[0];

  if (!image) throw new NotFoundError(`No image: ${id}`);

  return image;
}



  /** Delete given image from database; returns undefined.
   *
   * Throws NotFoundError if image not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM images
           WHERE id = $1
           RETURNING id`,
        [id]);
    const image = result.rows[0];
  
    if (!image) throw new NotFoundError(`No image: ${id}`);
  }
  

}


module.exports = Image;
