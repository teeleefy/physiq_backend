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


 

}


module.exports = Visit;
