"use strict";

const db = require("../../db");
const bcrypt = require("bcrypt");
const { formatDate } = require('../../helpers/formatDate.js')
const { sqlForPartialUpdate } = require("../../helpers/sql");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for families table. */

class Member {
/** Create a member (from data), update db, return new company data.
   *
   * data should be { familyId, firstName, lastName, birthday }
   *
   * Returns { id, familyId, firstName, lastName, birthday }
   *
   *
   * */
  static async create({ familyId, firstName, lastName, birthday }) {
    const familyIdCheck = await db.query(
      `SELECT id, name
       FROM families
       WHERE id = $1`,
    [familyId]);

if (!familyIdCheck.rows[0])
  throw new BadRequestError(`No existing family: ${familyId}`);


    const result = await db.query(
          `INSERT INTO family_members
           (family_id, first_name, last_name, birthday)
           VALUES ($1, $2, $3, $4)
           RETURNING id, family_id AS "familyId", first_name AS "firstName", last_name AS "lastName", birthday`,
        [
          familyId, 
          firstName,
          lastName,
          birthday
        ],
    );

    const member = result.rows[0];

    member.birthday = formatDate(member.birthday);

    return member;
  }

  /** Find all members.
   *
   * Returns [{ id, family_id, first_name, last_name, birthday}, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT id,
                  family_id AS "familyId",
                  first_name AS "firstName",
                  last_name AS "lastName",
                  birthday
           FROM family_members
           ORDER BY family_id`,
    );
    const members = result.rows.map(member => ({
        id: member.id,
        familyId: member.familyId,
        firstName: member.firstName,
        lastName: member.lastName,
        birthday: formatDate(member.birthday)
    }));
    return members;
  }

  /** Given an id, return data about a member.
   *
   * Returns { id, familyId, firstName, lastName, birthday }
   *   
   *
   * Throws NotFoundError if member not found.
   **/

  static async get(id) {
    const memberRes = await db.query(
          `SELECT id,
                  family_id AS "familyId",
                  first_name AS "firstName",
                  last_name AS "lastName",
                  birthday
           FROM family_members
           WHERE id = $1`,
        [id],
    );

    const member = memberRes.rows[0];

    if (!member) throw new NotFoundError(`No member: ${id}`);

    member.birthday = formatDate(member.birthday);

    return member;
  }

   /** Given a member_id, return list of member's allergies.
   *
   * Returns allergies: [{ id, member_id, name, reaction, notes }
   *  
   *
   * Throws NotFoundError if family not found.
   **/

  static async getAllergies(member_id) {
    const allergyRes = await db.query(
          `SELECT id,
                  name,
                  reaction,
                  notes
           FROM allergies
           WHERE member_id = $1
           ORDER BY id`,
        [member_id]);

    const allergies = allergyRes.rows;

    if (!allergies) throw new NotFoundError(`No member_id: ${member_id}`);

    return allergies;
  }

   /** Given a member_id, return list of member's diagnoses.
   *
   * Returns diagnoses: [{ }]
   *  
   *
   * 
   **/

  static async getDiagnoses(member_id) {
    const diagnosesRes = await db.query(
          `SELECT id,
                name,
                date_received AS "dateReceived",
                notes
           FROM diagnoses
           WHERE member_id = $1
           ORDER BY id`,
        [member_id]);

    const diagnoses = diagnosesRes.rows.map(diagnosis => ({
      id: diagnosis.id,
      name: diagnosis.name,
      dateReceived: formatDate(diagnosis.dateReceived),
      notes: diagnosis.notes
  }));

    return diagnoses;
  }

   /** Given a member_id, return list of member's insurance images.
   *
   * Returns images: [{ id, member_id, path}, ...]
   *  
   *
   * 
   **/

  static async getImages(member_id) {
    const res = await db.query(
          `SELECT id,
                path
           FROM images
           WHERE member_id = $1
           ORDER BY id`,
        [member_id]);

    return res.rows;
  }

 /** Given a member_id, return list of member's insurance.
   *
   * Returns insurance: [{ }]
   *  
   *
   * 
   **/

 static async getInsurance(member_id) {
  const result = await db.query(
        `SELECT id,
                type, 
                company_name AS "companyName",
                insured_name AS "insuredName",
                start_date AS "startDate",
                end_date AS "endDate",
                group_num AS "groupNum",
                contract_num AS "contractNum",
                notes,
                front_image_id AS "frontImageId",
                back_image_id AS "backImageId"
         FROM insurance
         WHERE member_id = $1
         ORDER BY id`,
      [member_id]);

      const allInsurance = result.rows.map(i => ({
        id: i.id,
        type: i.type,
        companyName: i.companyName,
        insuredName: i.insuredName,
        startDate: formatDate(i.startDate),
        endDate: formatDate(i.endDate),
        groupNum: i.groupNum,
        contractNum: i.contractNum,
        notes: i.notes,
        frontImageId: i.frontImageId,
        backImageId: i.backImageId
    }));
    

    return allInsurance;
}

 /** Given a member_id, return list of member's meds.
   *
   * Returns meds: [{ }]
   *  
   *
   * 
   **/

 static async getMeds(member_id) {
  const result = await db.query(
        `SELECT m.id,
                m.prescriber_id AS "prescriberId", 
                m.name, 
                m.start_date AS "startDate",
                m.end_date AS "endDate",
                m.indication, 
                m.dose,
                m.notes,
                d.name AS "prescriber"
         FROM meds m
         LEFT JOIN doctors d
         ON m.prescriber_id = d.id
         WHERE m.member_id = $1
         ORDER BY id`,
      [member_id]);

      const meds = result.rows.map(med => ({
        id: med.id,
        prescriberId: med.prescriberId,
        name: med.name,
        startDate: formatDate(med.startDate),
        endDate: formatDate(med.endDate),
        indication: med.indication,
        dose: med.dose,
        notes: med.notes,
        prescriber: med.prescriber
    }));

    return meds;
}
    

 /** Given a member_id, return list of member's symptoms.
   *
   * Returns symptoms: [{ }]
   **/

 static async getSymptoms(member_id) {
  const result = await db.query(
        `SELECT id,
                name,
                start_date AS "startDate",
                end_date AS "endDate",
                notes
         FROM symptoms
          WHERE member_id = $1
         ORDER BY id`,
        [member_id]
  );

  const symptoms = result.rows.map(symptom => ({
      id: symptom.id,
      name: symptom.name,
      startDate: formatDate(symptom.startDate),
      endDate: formatDate(symptom.endDate),
      notes: symptom.notes
  }));

  return symptoms
 }

 /** Given a member_id, return list of member's visits.
   *
   * Returns visits: [{ }]
   **/

 static async getVisits(member_id) {
  const result = await db.query(
        `SELECT v.id,
                v.doctor_id AS "doctorId",
                v.title,
                v.date,
                v.description,
                d.name AS "doctor", 
                d.clinic AS "clinic"
         FROM visits v
         LEFT JOIN doctors d
         ON v.doctor_id = d.id
          WHERE v.member_id = $1
         ORDER BY id`,
        [member_id]
  );

  const visits = result.rows.map(visit => ({
    id: visit.id,
    memberId: visit.memberId,
    doctorId: visit.doctorId,
    title: visit.title,
    date: formatDate(visit.date),
    description: visit.description,
    doctor: visit.doctor,
    clinic: visit.clinic
}));

  return visits;
}


   /** Given a member_id, return list of member's health goals.
   *
   * Returns goals: [{ }, ...]
   *  
   *
   * 
   **/

   static async getGoals(member_id) {
    const res = await db.query(
          `SELECT id,
                  goal_name AS "goalName", 
                  goal_details AS "goalDetails"
           FROM goals
           WHERE member_id = $1
           ORDER BY id`,
        [member_id]);

    return res.rows;
  }

   /** Given a member_id, return list of member's doctors.
   *
   * Returns [{ id, name, specialty, clinic, address, phone, notes}, ...]
   **/

   static async getDoctors(member_id) {
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
           WHERE member_id = $1
           ORDER BY id`,
           [member_id]);
   
    return result.rows;
  }


/** Update member data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { firstName, lastName, birthday }
   *
   * Returns { id, familyId, firstName, lastName, birthday }
   *
   * Throws NotFoundError if not found.
   */

static async update(id, data) {
  const { setColumns, values } = sqlForPartialUpdate(data,{  
    firstName: "first_name", 
    lastName: "last_name"});

  /*'id' will be added to the end of the values and passed into the end of the db query as an array, 
  so the index of 'id' will be the length of values plus one*/
  const idVarIdx = "$" + (values.length + 1);

  const sqlQuery = `UPDATE family_members
                    SET ${setColumns} 
                    WHERE id = ${idVarIdx} 
                    RETURNING id,
                              family_id AS "familyId",
                              first_name AS "firstName",
                              last_name AS "lastName",
                              birthday`;
  
  const result = await db.query(sqlQuery, [...values, id]);
  const member = result.rows[0];

  if (!member) throw new NotFoundError(`No member: ${id}`);

  member.birthday = formatDate(member.birthday);
    
  return member;
}


 /** Delete given member from database; returns undefined.
   *
   * Throws NotFoundError if member not found.
   **/

 static async remove(id) {
  const result = await db.query(
        `DELETE
         FROM family_members
         WHERE id = $1
         RETURNING id`,
      [id]);
  const member = result.rows[0];

  if (!member) throw new NotFoundError(`No member: ${id}`);
}


}




module.exports = Member;
