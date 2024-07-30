"use strict";

const db = require("../../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../../helpers/sql");
const { formatDate } = require('../../helpers/formatDate.js')

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");

const { BCRYPT_WORK_FACTOR } = require("../../config.js");

/** Related functions for families table. */

class Family {
  /** authenticate family with email, password.
   *
   * Returns { id, email, name, is_admin }
   *
   * Throws UnauthorizedError if family not found or wrong password.
   **/

  static async authenticate(email, password) {
    // try to find the family first
    const result = await db.query(
          `SELECT id,
                  email,
                  name,
                  password,
                  is_admin AS "isAdmin"
           FROM families
           WHERE email = $1`,
        [email],
    );

    const family = result.rows[0];

    if (family) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, family.password);
      if (isValid === true) {
        delete family.password;
        const familyMembersRes = await db.query(
          `SELECT id
           FROM family_members
           WHERE family_id = $1`, [family.id]);
    
    
          family.memberIds = familyMembersRes.rows.map(m => m.id);


        return family;
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }

  /** Register family with data.
   *
   * Returns { id, email, name, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      { email, password, name, isAdmin }) {
    const duplicateCheck = await db.query(
          `SELECT email
           FROM families
           WHERE email = $1`,
        [email],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }
    
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    //handle if isAdmin was not passed as true or false
    if(typeof isAdmin !== 'boolean'){isAdmin = "false"}

    const result = await db.query(
          `INSERT INTO families
           (email,
            password,
            name,
            is_admin)
           VALUES ($1, $2, $3, $4)
           RETURNING id, email, name, is_admin AS "isAdmin"`,
        [
          email,
          hashedPassword,
          name,
          isAdmin
        ],
    );

    const family = result.rows[0];
    return family;
  }

  /** Find all families.
   *
   * Returns [{ id, email, name, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT id,
                  email,
                  name,
                  is_admin AS "isAdmin"
           FROM families
           ORDER BY id`,
    );

    return result.rows;
  }

  /** Given an id, return data about a family.
   *
   * Returns { id, email, name, is_admin, family_members }
   *   where family_member is { id, first_name, last_name }
   *
   * Throws NotFoundError if family not found.
   **/

  static async get(id) {
    const familyRes = await db.query(
          `SELECT id,
                  email,
                  name,
                  is_admin AS "isAdmin"
           FROM families
           WHERE id = $1`,
        [id],
    );

    const family = familyRes.rows[0];

    if (!family) throw new NotFoundError(`No family: ${id}`);

    const familyMembersRes = await db.query(
          `SELECT id, 
                  first_name AS "firstName", 
                  last_name AS "lastName",
                  birthday
           FROM family_members
           WHERE family_id = $1`, [family.id]);

           const familyMembers = familyMembersRes.rows.map(member => ({
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            birthday: formatDate(member.birthday)
        }));
    
    family.familyMembers = familyMembers;
    return family;
  }


/** Update family data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { email, name }
   *
   * Returns { id, email, name, is_admin }
   *
   * Throws NotFoundError if not found.
   */

static async update(id, data) {
  if(data.email){
        const duplicateCheck = await db.query(
          `SELECT email
          FROM families
          WHERE email = $1`,
        [data.email]);

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${data.email}`);
    }
  }

  const { setColumns, values } = sqlForPartialUpdate(data,{});

  /*'id' will be added to the end of the values and passed into the end of the db query as an array, 
  so the index of 'id' will be the length of values plus one*/
  const idVarIdx = "$" + (values.length + 1);

  const sqlQuery = `UPDATE families
                    SET ${setColumns} 
                    WHERE id = ${idVarIdx} 
                    RETURNING id,
                              email,
                              name,
                              is_admin AS "isAdmin"`;
  
  const result = await db.query(sqlQuery, [...values, id]);
  const family = result.rows[0];

  if (!family) throw new NotFoundError(`No family: ${id}`);

  return family;
}

/** Update family password.
   *
   *
   * Data can include: { password }
   *
   * Returns { id, email, name, is_admin }
   *
   * Throws NotFoundError if not found.
   */

static async updatePassword(id, {password}) {

  const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  const sqlQuery = `UPDATE families
                    SET password = $1 
                    WHERE id = $2 
                    RETURNING id,
                              email,
                              name,
                              is_admin AS "isAdmin"`;
  
  const result = await db.query(sqlQuery, [hashedPassword, id]);
  const family = result.rows[0];

  if (!family) throw new NotFoundError(`No family: ${id}`);

  return { id: `${family.id}`, passwordStatus: "updated"};
}

 /** Delete given family from database; returns undefined.
   *
   * Throws NotFoundError if family not found.
   **/

 static async remove(id) {
  const result = await db.query(
        `DELETE
         FROM families
         WHERE id = $1
         RETURNING id`,
      [id]);
  const family = result.rows[0];

  if (!family) throw new NotFoundError(`No family: ${id}`);
  return family;
}

}


module.exports = Family;
