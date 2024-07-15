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

class Visit {

  /** Create a visit (from data), update db, return new visit data.
   *
   * data should be { memberId, doctorId, title, date, description }
  *
  * Returns { id, memberId, doctorId, title, date, description }
  *
   * */
  static async create({ memberId, doctorId, title, date, description }) {
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
   * Returns [{ id, member_id, doctor_id, title, date, description}, ...]
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

 static async remove(id) {
  const result = await db.query(
        `DELETE
         FROM visits
         WHERE id = $1
         RETURNING id`,
      [id]);
  const visit = result.rows[0];

  if (!visit) throw new NotFoundError(`No visit: ${id}`);
}

 

}


module.exports = Visit;
