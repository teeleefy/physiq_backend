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

class Med {

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
   * Returns { }
   *
   * Throws NotFoundError if med not found.
   **/

static async get(id) {
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
        [id],
    );

    const med = result.rows[0];

    if (!med) throw new NotFoundError(`No med: ${id}`);

    med.startDate = formatDate(med.startDate);
    med.endDate = formatDate(med.endDate);
    
    return med;
  }


 

}


module.exports = Med;
