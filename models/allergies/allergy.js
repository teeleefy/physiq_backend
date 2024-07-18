"use strict";

const db = require("../../db");
const bcrypt = require("bcrypt");
const { formatDate } = require('../../helpers/formatDate.js')
const { sqlForPartialUpdate } = require("../../helpers/sql.js");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for allergies table. */

class Allergy {

  /** Create a allergy (from data), update db, return new allergy data.
   *
   *data should be { name, reaction, notes }
   *
   * Returns { id, memberId, name, reaction, notes }
   *
   * */
  static async create({ name, reaction, notes }, memberId) {
    const memberIdCheck = await db.query(
      `SELECT id, 
        first_name AS "firstName"
       FROM family_members
       WHERE id = $1`,
    [memberId]);

if (!memberIdCheck.rows[0])
  throw new BadRequestError(`No existing member: ${memberId}`);


    const result = await db.query(
          `INSERT INTO allergies
           (member_id, name, reaction, notes)
           VALUES ($1, $2, $3, $4)
           RETURNING id, member_id AS "memberId", name, reaction, notes`,
        [
          memberId, 
          name, 
          reaction, 
          notes
        ],
    );

    const allergy = result.rows[0];

    return allergy;
  }




  /** Find all allergies.
   *
   * Returns [{ id, member_id, name, reaction, notes}, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  name,
                  reaction,
                  notes
           FROM allergies
           ORDER BY member_id`,
    );
   
    return result.rows;
  }

  /** Given an id, return allergy.
   *
   * Returns allergy: [{ id, member_id, name, reaction, notes }
   *  
   *
   * Throws NotFoundError if family not found.
   **/

  static async get(id) {
    const allergyRes = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  name,
                  reaction,
                  notes
           FROM allergies
           WHERE id = $1`,
        [id]);

    const allergy = allergyRes.rows[0];

    if (!allergy) throw new NotFoundError(`No allergy id: ${id}`);

    return allergy;
  }


 /** Update allergy data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { name, reaction, notes }
   *
   * Returns { id, memberId, name, reaction, notes }
   *
   * Throws NotFoundError if not found.
   */

 static async update(data, allergyId, memberId) {
  const allergyRes = await db.query(
    `SELECT id,
            member_id AS "memberId",
            name,
            reaction,
            notes
    FROM allergies
    WHERE id = $1`,
  [allergyId]);

  const allergy = allergyRes.rows[0];

  //Check to see if allergy exists by allergyId in db
  if (!allergy) throw new NotFoundError(`No allergy: ${allergyId}`);
  //Confirm authorization: Check to see if memberId matches the allergy's member_id in db
  if (allergy.memberId !== memberId) throw new UnauthorizedError();


  const { setColumns, values } = sqlForPartialUpdate(data,{});

  /*'id' will be added to the end of the values and passed into the end of the db query as an array, 
  so the index of 'id' will be the length of values plus one*/
  const idVarIdx = "$" + (values.length + 1);

  const sqlQuery = `UPDATE allergies 
                    SET ${setColumns} 
                    WHERE id = ${idVarIdx} 
                    RETURNING id,
                              member_id AS "memberId",
                              name,
                              reaction,
                              notes`;
  
  const result = await db.query(sqlQuery, [...values, allergyId]);
  const updatedAllergy = result.rows[0];

  return updatedAllergy;
}


   /** Delete given allergy from database; returns undefined.
   *
   * Throws NotFoundError if allergy not found.
   **/

   static async remove(allergyId, memberId) {
      const allergyRes = await db.query(
        `SELECT id,
                member_id AS "memberId",
                name,
                reaction,
                notes
        FROM allergies
        WHERE id = $1`,
      [allergyId]);

      const allergy = allergyRes.rows[0];

      //Check to see if allergy exists by allergyId in db
      if (!allergy) throw new NotFoundError(`No allergy: ${allergyId}`);
      //Confirm authorization: Check to see if memberId matches the allergy's member_id in db
      if (allergy.memberId !== memberId) throw new UnauthorizedError();

      const result = await db.query(
            `DELETE
            FROM allergies
            WHERE id = $1
            RETURNING id`,
          [allergyId]);
      
      const deletedAllergy = result.rows[0];

      return deletedAllergy;
  }


}


module.exports = Allergy;
