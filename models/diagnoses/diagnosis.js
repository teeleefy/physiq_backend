"use strict";

const db = require("../../db");

const { formatDate } = require('../../helpers/formatDate.js')
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for diagnoses table. */

class Diagnosis {

    /** Create a diagnosis (from data), update db, return new diagnosis data.
   *
   * data should be { memberId, name, dateReceived, notes}
   *
   * Returns { id, memberId, name, dateReceived, notes }
   *
   * */
   static async create({ memberId, name, dateReceived, notes }) {
    const memberIdCheck = await db.query(
      `SELECT id, 
        first_name AS "firstName"
       FROM family_members
       WHERE id = $1`,
    [memberId]);

if (!memberIdCheck.rows[0])
  throw new BadRequestError(`No existing member: ${memberId}`);


    const result = await db.query(
          `INSERT INTO diagnoses
           (member_id, name, date_received, notes)
           VALUES ($1, $2, $3, $4)
           RETURNING id, member_id AS "memberId", name, date_received AS "dateReceived", notes`,
        [
          memberId, 
          name, 
          dateReceived, 
          notes
        ],
    );

    const diagnosis = result.rows[0];
    diagnosis.dateReceived = formatDate(diagnosis.dateReceived);
    
    return diagnosis;
  }



   /** Find all diagnoses.
   *
   * Returns [{ }, ...]
   **/

   static async findAll() {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  name,
                  date_received AS "dateReceived",
                  notes
           FROM diagnoses
           ORDER BY member_id`,
    );
    const diagnoses = result.rows.map(diagnosis => ({
        id: diagnosis.id,
        memberId: diagnosis.memberId,
        name: diagnosis.name,
        dateReceived: formatDate(diagnosis.dateReceived),
        notes: diagnosis.notes
    }));

    return diagnoses;
  }

  /** Given an id, return data about a diagnoses.
   *
   * Returns { }
   *
   * Throws NotFoundError if diagnoses not found.
   **/

  static async get(id) {
    const diagnosisRes = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  name,
                  date_received AS "dateReceived",
                  notes
           FROM diagnoses
           WHERE id = $1`,
        [id],
    );

    const diagnosis = diagnosisRes.rows[0];

    if (!diagnosis) throw new NotFoundError(`No diagnosis: ${id}`);

    diagnosis.dateReceived = formatDate(diagnosis.dateReceived);
    
    return diagnosis;
  }

 /** Delete given diagnosis from database; returns undefined.
   *
   * Throws NotFoundError if diagnosis not found.
   **/

 static async remove(id) {
  const result = await db.query(
        `DELETE
         FROM diagnoses
         WHERE id = $1
         RETURNING id`,
      [id]);
  const diagnosis = result.rows[0];

  if (!diagnosis) throw new NotFoundError(`No diagnosis: ${id}`);
}

}


module.exports = Diagnosis;
