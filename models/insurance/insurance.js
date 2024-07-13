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

class Insurance {

   /** Find all insurance.
   *
   * Returns [ {id, member_id, type, company_name, insured_name, start_date, end_date, group_num, contract_num, notes, front_image_id, back_image_id }, ... ]
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
   * Returns { }
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

 

}


module.exports = Insurance;
