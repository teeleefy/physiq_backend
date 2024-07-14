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

  /** Create a med (from data), update db, return new med data.
   *
   * data should be {  memberId, prescriberId, name, startDate, endDate, indication, dose, notes }
   *
   * Returns { id, memberId, prescriberId, name, startDate, endDate, indication, dose, notes }
   *
   * */
  static async create({ memberId, prescriberId, name, startDate, endDate, indication, dose, notes }) {
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
