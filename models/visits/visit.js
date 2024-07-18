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

class Visit {

  /** Create a visit (from data), update db, return new visit data.
   *
   * data should be { doctorId, title, date, description }
  *
  * Returns { id, memberId, doctorId, title, date, description }
  *
   * */
  static async create({ doctorId, title, date, description }, memberId) {
    const memberIdCheck = await db.query(
      `SELECT id, 
        first_name AS "firstName"
       FROM family_members
       WHERE id = $1`,
    [memberId]);

if (!memberIdCheck.rows[0])
  throw new BadRequestError(`No existing member: ${memberId}`);


    const result = await db.query(
          `INSERT INTO visits
           (member_id, doctor_id, title, date, description)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING 
            id, 
            member_id AS "memberId", 
            doctor_id AS "doctorId", 
            title, 
            date, 
            description`,
        [
          memberId, 
          doctorId, 
          title, 
          date, 
          description
        ],
    );

    const visit = result.rows[0];
    visit.date = formatDate(visit.date);
    
    return visit;
  }


   /** Find all visits.
   *
   * Returns [{ id, memberId, doctorId, title, date, description}, ...]
   **/

   static async findAll() {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  doctor_id AS "doctorId",
                  title,
                  date,
                  description
           FROM visits
           ORDER BY doctor_id`,
    );
    const visits = result.rows.map(visit => ({
        id: visit.id,
        memberId: visit.memberId,
        doctorId: visit.doctorId,
        title: visit.title,
        date: formatDate(visit.date),
        description: visit.description
    }));

    return visits;
  }

/** Update visit data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { doctorId, title, date, description }
   *
   * Returns { id, memberId, doctorId, title, date, description }
   *
   * Throws NotFoundError if not found.
   */

static async update(data, visitId, memberId) {
  const visitRes = await db.query(
    `SELECT id,
            member_id AS "memberId"
      FROM visits
      WHERE id = $1`,
      [visitId]);

  const visitCheck = visitRes.rows[0];

  //Check to see if visit exists by visitId in db
  if (!visitCheck) throw new NotFoundError(`No visit: ${visitId}`);
  //Confirm authorization: Check to see if memberId matches the visit member_id in db
  if (visitCheck.memberId !== memberId) throw new UnauthorizedError();

  const { setColumns, values } = sqlForPartialUpdate(data,{doctorId: "doctor_id"});

  /*'id' will be added to the end of the values and passed into the end of the db query as an array, 
  so the index of 'id' will be the length of values plus one*/
  const idVarIdx = "$" + (values.length + 1);

  const sqlQuery = `UPDATE visits
                    SET ${setColumns} 
                    WHERE id = ${idVarIdx} 
                    RETURNING id,
                              member_id AS "memberId",
                              doctor_id AS "doctorId",
                              title,
                              date,
                              description`;
  
  const result = await db.query(sqlQuery, [...values, visitId]);
  const visit = result.rows[0];

  visit.date = formatDate(visit.date);
    
  return visit;
}


/** Given an id, return data about a visit.
   *
   * Returns { }
   *
   * Throws NotFoundError if visit not found.
   **/

static async get(id) {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  doctor_id AS "doctorId",
                  title,
                  date,
                  description
           FROM visits
           WHERE id = $1
           ORDER BY id`,
        [id],
    );

    const visit = result.rows[0];

    if (!visit) throw new NotFoundError(`No visit: ${id}`);

    visit.date = formatDate(visit.date);
    
    return visit;
  }

 /** Delete given visit from database; returns undefined.
   *
   * Throws NotFoundError if visit not found.
   **/

 static async remove(visitId, memberId) {
  const visitRes = await db.query(
    `SELECT id,
            member_id AS "memberId"
      FROM visits
      WHERE id = $1`,
      [visitId]);

  const visitCheck = visitRes.rows[0];

  //Check to see if visit exists by visitId in db
  if (!visitCheck) throw new NotFoundError(`No visit: ${visitId}`);
  //Confirm authorization: Check to see if memberId matches the visit member_id in db
  if (visitCheck.memberId !== memberId) throw new UnauthorizedError();

  const result = await db.query(
        `DELETE
         FROM visits
         WHERE id = $1
         RETURNING id`,
      [visitId]);
  const deletedVisit = result.rows[0];

  return deletedVisit;
}

 

}


module.exports = Visit;
