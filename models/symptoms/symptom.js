"use strict";

const db = require("../../db");

const { formatDate } = require('../../helpers/formatDate.js')
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for visits table. */

class Symptom {

   /** Create a symptom (from data), update db, return new symptom data.
   *
   * data should be { memberId, name, startDate, endDate, notes }
  *
  * Returns { id, memberId, name, startDate, endDate, notes  }
  *
   * */
   static async create({ memberId, name, startDate, endDate, notes  }) {
    const memberIdCheck = await db.query(
      `SELECT id, 
        first_name AS "firstName"
       FROM family_members
       WHERE id = $1`,
    [memberId]);

if (!memberIdCheck.rows[0])
  throw new BadRequestError(`No existing member: ${memberId}`);


    const result = await db.query(
          `INSERT INTO symptoms
           (member_id, name, start_date, end_date, notes )
           VALUES ($1, $2, $3, $4, $5)
           RETURNING 
            id, 
            member_id AS "memberId", 
            name, 
            start_date AS "startDate", 
            end_date AS "endDate",  
            notes`,
        [
          memberId, 
          name, 
          startDate, 
          endDate, 
          notes 
        ],
    );

    const symptom = result.rows[0];
    symptom.startDate = formatDate(symptom.startDate);
    symptom.endDate = formatDate(symptom.endDate);
    
    return symptom;
  }

   /** Find all symptoms.
   *
   * Returns {id, member_id, name, start_date, end_date, notes}
   **/

   static async findAll() {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  name,
                  start_date AS "startDate",
                  end_date AS "endDate",
                  notes
           FROM symptoms
           ORDER BY member_id`,
    );
    const symptoms = result.rows.map(symptom => ({
        id: symptom.id,
        memberId: symptom.memberId,
        name: symptom.name,
        startDate: formatDate(symptom.startDate),
        endDate: formatDate(symptom.endDate),
        notes: symptom.notes
    }));

    return symptoms;
  }

/** Given an id, return data about a symptom.
   *
   * Returns { }
   *
   * Throws NotFoundError if symptom not found.
   **/

static async get(id) {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  name,
                  start_date AS "startDate",
                  end_date AS "endDate",
                  notes
           FROM symptoms
           WHERE id = $1
           ORDER BY id`,
        [id],
    );

    const symptom = result.rows[0];

    if (!symptom) throw new NotFoundError(`No symptom: ${id}`);

    symptom.startDate = formatDate(symptom.startDate);
    symptom.endDate = formatDate(symptom.endDate);
    
    return symptom;
  }

 

}


module.exports = Symptom;
