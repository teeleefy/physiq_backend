"use strict";

const db = require("../../db");

// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for allergies table. */

class Doctor {

    /** Create a doctor (from data), update db, return new doctor data.
   *
   * data should be { memberId, name, specialty, clinic, address, phone, notes }
   *
   * Returns { id, memberId, name, specialty, clinic, address, phone, notes }
   *
   * */
    static async create({ memberId, name, specialty, clinic, address, phone, notes}) {
      const memberIdCheck = await db.query(
        `SELECT id, 
          first_name AS "firstName"
         FROM family_members
         WHERE id = $1`,
      [memberId]);
  
  if (!memberIdCheck.rows[0])
    throw new BadRequestError(`No existing member: ${memberId}`);
  
  
      const result = await db.query(
            `INSERT INTO doctors
             (member_id, name, specialty, clinic, address, phone, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, member_id AS "memberId", name, specialty, clinic, address, phone, notes`,
          [
            memberId, 
            name, 
            specialty,
            clinic,
            address,
            phone,
            notes
          ],
      );
  
      const doctor = result.rows[0];
      
      return doctor;
    }
  


  /** Find all doctors.
   *
   * Returns [{ id, member_id, name, specialty, clinic, address, phone, notes}, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  name,
                  specialty,
                  clinic,
                  address,
                  phone,
                  notes
           FROM doctors
           ORDER BY member_id`,
    );
   
    return result.rows;
  }

  /** Given an id, return data about a doctor.
   *
   * Returns { }
   *
   * Throws NotFoundError if doctor not found.
   **/

  static async get(id) {
    const doctorRes = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  name,
                  specialty,
                  clinic,
                  address,
                  phone,
                  notes
           FROM doctors
           WHERE id = $1`,
        [id],
    );

    const doctor = doctorRes.rows[0];

    if (!doctor) throw new NotFoundError(`No doctor: ${id}`);

    return doctor;
  }

 /** Delete given doctor from database; returns undefined.
   *
   * Throws NotFoundError if doctor not found.
   **/

 static async remove(id) {
  const result = await db.query(
        `DELETE
         FROM doctors
         WHERE id = $1
         RETURNING id`,
      [id]);
  const doctor = result.rows[0];

  if (!doctor) throw new NotFoundError(`No doctor: ${id}`);
}

}


module.exports = Doctor;
