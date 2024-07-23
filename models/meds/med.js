"use strict";

const db = require("../../db");

const { formatDate } = require('../../helpers/formatDate.js')
const { sqlForPartialUpdate } = require("../../helpers/sql");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for visits table. */

class Med {

  /** Create a med (from data), update db, return new med data.
   *
   * data should be { prescriberId, name, startDate, endDate, indication, dose, notes }
   *
   * Returns { id, memberId, prescriberId, name, startDate, endDate, indication, dose, notes }
   *
   * */
  static async create({ prescriberId, name, startDate, endDate, indication, dose, notes }, memberId) {
    const memberIdCheck = await db.query(
      `SELECT id, 
        first_name AS "firstName"
       FROM family_members
       WHERE id = $1`,
    [memberId]);

if (!memberIdCheck.rows[0])
  throw new BadRequestError(`No existing member: ${memberId}`);


    const result = await db.query(
          `INSERT INTO meds
           ( member_id, prescriber_id, name, start_date, end_date, indication, dose, notes )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING 
            id,
            member_id AS "memberId", 
            prescriber_id AS "prescriberId", 
            name, 
            start_date AS "startDate", 
            end_date AS "endDate", 
            indication, 
            dose, 
            notes`,
        [
          memberId, 
          prescriberId, 
          name, 
          startDate, 
          endDate, 
          indication, 
          dose, 
          notes
        ],
    );

    const med = result.rows[0];
    //Format Dates
    med.startDate = formatDate(med.startDate);
    med.endDate = formatDate(med.endDate);
    
    return med;
  }


   /** Find all meds.
   *
   * Returns { meds: [ {id, member_id, prescriber_id, name, start_date, end_date, indication, dose, notes }, ... ] }
   **/

   static async findAll() {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId", 
                  prescriber_id AS "prescriberId", 
                  name, 
                  start_date AS "startDate",
                  end_date AS "endDate",
                  indication, 
                  dose,
                  notes
           FROM meds
           ORDER BY member_id`,
    );
    const meds = result.rows.map(med => ({
        id: med.id,
        memberId: med.memberId,
        prescriberId: med.prescriberId,
        name: med.name,
        startDate: formatDate(med.startDate),
        endDate: formatDate(med.endDate),
        indication: med.indication,
        dose: med.dose,
        notes: med.notes
    }));

    return meds;
  }

/** Given an id, return data about a med.
   *
   * Returns { id, memberId, prescriberId, name, startDate, endDate, indication, dose, notes }
   *
   * Throws NotFoundError if med not found.
   **/

static async get(medId, memberId) {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId", 
                  prescriber_id AS "prescriberId", 
                  name, 
                  start_date AS "startDate",
                  end_date AS "endDate",
                  indication, 
                  dose,
                  notes
           FROM meds
           WHERE id = $1
           ORDER BY id`,
        [medId],
    );

    const med = result.rows[0];

    //Check to see if med exists by medId in db
    if (!med) throw new NotFoundError(`No med: ${medId}`);
    //Confirm authorization: Check to see if memberId matches the med member_id in db
    if (med.memberId !== memberId) throw new UnauthorizedError();

    
    med.startDate = formatDate(med.startDate);
    med.endDate = formatDate(med.endDate);
    
    return med;
  }


/** Update med data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { prescriberId, name, startDate, endDate, indication, dose, notes }
   *
   * Returns { id, memberId, prescriberId, name, startDate, endDate, indication, dose, notes }
   *
   * Throws NotFoundError if not found.
   */

static async update(data, medId, memberId) {
  const medRes = await db.query(
    `SELECT id,
            member_id AS "memberId"
      FROM meds
      WHERE id = $1`,
      [medId]);

  const medCheck = medRes.rows[0];

  //Check to see if med exists by medId in db
  if (!medCheck) throw new NotFoundError(`No med: ${medId}`);
  //Confirm authorization: Check to see if memberId matches the med member_id in db
  if (medCheck.memberId !== memberId) throw new UnauthorizedError();

  const { setColumns, values } = sqlForPartialUpdate(data,{ 
    prescriberId: "prescriber_id", 
    startDate: "start_date", 
    endDate: "end_date"});

  /*'id' will be added to the end of the values and passed into the end of the db query as an array, 
  so the index of 'id' will be the length of values plus one*/
  const idVarIdx = "$" + (values.length + 1);

  const sqlQuery = `UPDATE meds
                    SET ${setColumns} 
                    WHERE id = ${idVarIdx} 
                    RETURNING id,
                              member_id AS "memberId", 
                              prescriber_id AS "prescriberId", 
                              name, 
                              start_date AS "startDate",
                              end_date AS "endDate",
                              indication, 
                              dose,
                              notes`;
  
  const result = await db.query(sqlQuery, [...values, medId]);
  const med = result.rows[0];

  med.startDate = formatDate(med.startDate);
  med.endDate = formatDate(med.endDate);
    
  return med;
}

  /** Delete given med from database; returns undefined.
   *
   * Throws NotFoundError if med not found.
   **/

  static async remove(medId, memberId) {
    const medRes = await db.query(
      `SELECT id,
              member_id AS "memberId"
        FROM meds
        WHERE id = $1`,
        [medId]);
  
    const medCheck = medRes.rows[0];
  
    //Check to see if med exists by medId in db
    if (!medCheck) throw new NotFoundError(`No med: ${medId}`);
    //Confirm authorization: Check to see if memberId matches the med member_id in db
    if (medCheck.memberId !== memberId) throw new UnauthorizedError();

    const result = await db.query(
          `DELETE
           FROM meds
           WHERE id = $1
           RETURNING id`,
        [medId]);
    const deletedMed = result.rows[0];
  
    return deletedMed;
  }
  

}


module.exports = Med;
