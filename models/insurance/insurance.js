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

class Insurance {

   /** Create a insurance (from data), update db, return new insurance data.
   *
   * data should be {  memberId, type, companyName, insuredName, startDate, endDate, groupNum, contractNum, notes, frontImageId, backImageId }
   *
   * Returns { id, memberId, type, companyName, insuredName, startDate, endDate, groupNum, contractNum, notes, frontImageId, backImageId }
   *
   * */
   static async create({ memberId, type, companyName, insuredName, startDate, endDate, groupNum, contractNum, notes, frontImageId, backImageId}) {
    const memberIdCheck = await db.query(
      `SELECT id, 
        first_name AS "firstName"
       FROM family_members
       WHERE id = $1`,
    [memberId]);

if (!memberIdCheck.rows[0])
  throw new BadRequestError(`No existing member: ${memberId}`);


    const result = await db.query(
          `INSERT INTO insurance
           ( member_id, type, company_name, insured_name, start_date, end_date, group_num, contract_num, notes, front_image_id, back_image_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING 
            id,
            member_id AS "memberId", 
            type, 
            company_name AS "companyName", 
            insured_name AS "insuredName", 
            start_date AS "startDate", 
            end_date AS "endDate", 
            group_num AS "groupNum", 
            contract_num AS "contractNum", 
            notes, 
            front_image_id AS "frontImageId", 
            back_image_id AS "backImageId"`,
        [
          memberId, 
          type, 
          companyName, 
          insuredName, 
          startDate, 
          endDate, 
          groupNum, 
          contractNum, 
          notes, 
          frontImageId, 
          backImageId
        ],
    );

    const insurance = result.rows[0];
    //Format Dates
    insurance.startDate = formatDate(insurance.startDate);
    insurance.endDate = formatDate(insurance.endDate);
    
    return insurance;
  }

   /** Find all insurance.
   *
   * Returns [ {id, member_id, type, company_name, insured_name, start_date, end_date, group_num, 
   * contract_num, notes, front_image_id, back_image_id }, ... ]
   **/

   static async findAll() {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId", 
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
           ORDER BY member_id`,
    );
    const allInsurance = result.rows.map(i => ({
        id: i.id,
        memberId: i.memberId,
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

/** Given an id, return data about a insurance.
   *
   * Returns { id, member_id, type, company_name, insured_name, start_date, end_date, group_num, 
   * contract_num, notes, front_image_id, back_image_id}
   *
   * Throws NotFoundError if insurance not found.
   **/

static async get(id) {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId",
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
           WHERE id = $1`,
        [id],
    );

    const insurance = result.rows[0];

    if (!insurance) throw new NotFoundError(`No insurance: ${id}`);

    insurance.startDate = formatDate(insurance.startDate);
    insurance.endDate = formatDate(insurance.endDate);
    
    return insurance;
  }


 /** Update insurance data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { type, companyName, insuredName, startDate, endDate, groupNum, 
   * contractNum, notes, frontImageId, backImageId }
   *
   * Returns { id, memberId, type, companyName, insuredName, startDate, endDate, groupNum, 
   * contractNum, notes, frontImageId, backImageId  }
   *
   * Throws NotFoundError if not found.
   */

 static async update(id, data) {
  const { setColumns, values } = sqlForPartialUpdate(data,{ 
    companyName: "company_name", 
    insuredName: "insured_name", 
    startDate: "start_date", 
    endDate: "end_date", 
    groupNum: "group_num", 
    contractNum: "contract_num", 
    frontImageId: "front_image_id", 
    backImageId: "back_image_id"});

  /*'id' will be added to the end of the values and passed into the end of the db query as an array, 
  so the index of 'id' will be the length of values plus one*/
  const idVarIdx = "$" + (values.length + 1);

  const sqlQuery = `UPDATE insurance 
                    SET ${setColumns} 
                    WHERE id = ${idVarIdx} 
                    RETURNING id,
                              member_id AS "memberId",
                              type, 
                              company_name AS "companyName",
                              insured_name AS "insuredName",
                              start_date AS "startDate",
                              end_date AS "endDate",
                              group_num AS "groupNum",
                              contract_num AS "contractNum",
                              notes,
                              front_image_id AS "frontImageId",
                              back_image_id AS "backImageId"`;
  
  const result = await db.query(sqlQuery, [...values, id]);
  const insurance = result.rows[0];

  if (!insurance) throw new NotFoundError(`No insurance: ${id}`);

  insurance.startDate = formatDate(insurance.startDate);
  insurance.endDate = formatDate(insurance.endDate);
    
  return insurance;
}


  /** Delete given insurance from database; returns undefined.
   *
   * Throws NotFoundError if insurance not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM insurance
           WHERE id = $1
           RETURNING id`,
        [id]);
    const insurance = result.rows[0];
  
    if (!insurance) throw new NotFoundError(`No insurance: ${id}`);
  }
  

}


module.exports = Insurance;
