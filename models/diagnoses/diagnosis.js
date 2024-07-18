"use strict";

const db = require("../../db");

const { formatDate } = require('../../helpers/formatDate.js')
const { sqlForPartialUpdate } = require("../../helpers/sql.js");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for diagnoses table. */

class Diagnosis {

    /** Create a diagnosis (from data), update db, return new diagnosis data.
   *
   * data should be { name, dateReceived, notes}
   *
   * Returns { id, memberId, name, dateReceived, notes }
   *
   * */
   static async create({ name, dateReceived, notes }, memberId) {
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

 /** Update diagnosis data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { name, dateReceived, notes }
   *
   * Returns { id, memberId, name, dateReceived, notes }
   *
   * Throws NotFoundError if not found.
   */

 static async update(data, diagnosisId, memberId) {
  const diagnosisRes = await db.query(
    `SELECT id,
            member_id AS "memberId"
      FROM diagnoses
      WHERE id = $1`,
      [diagnosisId]);

  const diagnosisCheck = diagnosisRes.rows[0];

  //Check to see if diagnosis exists by diagnosisId in db
  if (!diagnosisCheck) throw new NotFoundError(`No diagnosis: ${diagnosisId}`);
  //Confirm authorization: Check to see if memberId matches the diagnosis member_id in db
  if (diagnosisCheck.memberId !== memberId) throw new UnauthorizedError();

  const { setColumns, values } = sqlForPartialUpdate(data,{ dateReceived: "date_received"});

  /*'id' will be added to the end of the values and passed into the end of the db query as an array, 
  so the index of 'id' will be the length of values plus one*/
  const idVarIdx = "$" + (values.length + 1);

  const sqlQuery = `UPDATE diagnoses 
                    SET ${setColumns} 
                    WHERE id = ${idVarIdx} 
                    RETURNING id,
                              member_id AS "memberId",
                              name,
                              date_received AS "dateReceived",
                              notes`;
  
  const result = await db.query(sqlQuery, [...values, diagnosisId]);
  const diagnosis = result.rows[0];

  diagnosis.dateReceived = formatDate(diagnosis.dateReceived);

  return diagnosis;
}

 /** Delete given diagnosis from database; returns undefined.
   *
   * Throws NotFoundError if diagnosis not found.
   * Throws UnauthorizedError if memberId does not match diagnosis memberId in db. 
   **/

 static async remove(diagnosisId, memberId) {
  const diagnosisRes = await db.query(
    `SELECT id,
            member_id AS "memberId"
      FROM diagnoses
      WHERE id = $1`,
      [diagnosisId]);

  const diagnosis = diagnosisRes.rows[0];

  //Check to see if diagnosis exists by diagnosisId in db
  if (!diagnosis) throw new NotFoundError(`No diagnosis: ${diagnosisId}`);
  //Confirm authorization: Check to see if memberId matches the diagnosis member_id in db
  if (diagnosis.memberId !== memberId) throw new UnauthorizedError();


  const result = await db.query(
        `DELETE
         FROM diagnoses
         WHERE id = $1
         RETURNING id`,
      [diagnosisId]);
  const deletedDiagnosis = result.rows[0];
    return deletedDiagnosis;
}

}


module.exports = Diagnosis;
