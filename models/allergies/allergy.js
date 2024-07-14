"use strict";

const db = require("../../db");
const bcrypt = require("bcrypt");
const { formatDate } = require('../../helpers/formatDate.js')
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for allergies table. */

class Allergy {

  /** Create a allergy (from data), update db, return new allergy data.
   *
   *data should be { memberId, name, reaction, notes }
   *
   * Returns { id, memberId, name, reaction, notes }
   *
   * */
  static async create({ memberId, name, reaction, notes }) {
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

 

}


module.exports = Allergy;
