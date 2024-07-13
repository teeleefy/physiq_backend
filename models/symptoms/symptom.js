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
