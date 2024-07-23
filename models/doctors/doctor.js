"use strict";

const db = require("../../db");

const { sqlForPartialUpdate } = require("../../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for allergies table. */

class Doctor {

    /** Create a doctor (from data), update db, return new doctor data.
   *
   * data should be { name, specialty, clinic, address, phone, notes }
   *
   * Returns { id, memberId, name, specialty, clinic, address, phone, notes }
   *
   * */
    static async create({ name, specialty, clinic, address, phone, notes}, memberId) {
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

  static async get(doctorId, memberId) {
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
        [doctorId],
    );

    const doctor = doctorRes.rows[0];

    //Check to see if doctor exists by doctorId in db
    if (!doctor) throw new NotFoundError(`No doctor: ${doctorId}`);
    //Confirm authorization: Check to see if memberId matches the doctor member_id in db
    if (doctor.memberId !== memberId) throw new UnauthorizedError();

    return doctor;
  }

/** Update doctor data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { name, specialty, clinic, address, phone, notes }
   *
   * Returns { id, memberId, name, specialty, clinic, address, phone, notes }
   *
   * Throws NotFoundError if not found.
   */

static async update(data, doctorId, memberId) {
  const doctorRes = await db.query(
    `SELECT id,
            member_id AS "memberId"
      FROM doctors
      WHERE id = $1`,
      [doctorId]);

  const doctorCheck = doctorRes.rows[0];

  //Check to see if doctor exists by doctorId in db
  if (!doctorCheck) throw new NotFoundError(`No doctor: ${doctorId}`);
  //Confirm authorization: Check to see if memberId matches the doctor member_id in db
  if (doctorCheck.memberId !== memberId) throw new UnauthorizedError();

  const { setColumns, values } = sqlForPartialUpdate(data,{});

  /*'id' will be added to the end of the values and passed into the end of the db query as an array, 
  so the index of 'id' will be the length of values plus one*/
  const idVarIdx = "$" + (values.length + 1);

  const sqlQuery = `UPDATE doctors
                    SET ${setColumns} 
                    WHERE id = ${idVarIdx} 
                    RETURNING id,
                              member_id AS "memberId",
                              name,
                              specialty,
                              clinic,
                              address,
                              phone,
                              notes`;
  
  const result = await db.query(sqlQuery, [...values, doctorId]);
  const doctor = result.rows[0];

  if (!doctor) throw new NotFoundError(`No doctor: ${doctorId}`);

  return doctor;
}

 /** Delete given doctor from database; returns undefined.
   *
   * Throws NotFoundError if doctor not found.
   **/

 static async remove(doctorId, memberId) {
  const doctorRes = await db.query(
    `SELECT id,
            member_id AS "memberId"
      FROM doctors
      WHERE id = $1`,
      [doctorId]);

  const doctor = doctorRes.rows[0];

  //Check to see if doctor exists by doctorId in db
  if (!doctor) throw new NotFoundError(`No doctor: ${doctorId}`);
  //Confirm authorization: Check to see if memberId matches the doctor member_id in db
  if (doctor.memberId !== memberId) throw new UnauthorizedError();

  const result = await db.query(
        `DELETE
         FROM doctors
         WHERE id = $1
         RETURNING id`,
      [doctorId]);
  const deletedDoctor = result.rows[0];
  return deletedDoctor;
  
}

}


module.exports = Doctor;
