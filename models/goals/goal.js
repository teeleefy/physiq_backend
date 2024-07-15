"use strict";

const db = require("../../db");

// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");



/** Related functions for goals table. */

class Goal {

 /** Create a goal (from data), update db, return new goal data.
   *
   *
   * data should be { memberId, goalName, goalDetails }
   *
   * Returns { id, memberId, goalName, goalDetails }
   *
   *
   * */
   static async create({ memberId, goalName, goalDetails }) {
    const memberIdCheck = await db.query(
      `SELECT id, 
        first_name AS "firstName"
       FROM family_members
       WHERE id = $1`,
    [memberId]);

if (!memberIdCheck.rows[0])
  throw new BadRequestError(`No existing member: ${memberId}`);


    const result = await db.query(
          `INSERT INTO goals
            (member_id, goal_name, goal_details)
           VALUES ($1, $2, $3)
           RETURNING 
            id, 
            member_id AS "memberId", 
            goal_name AS "goalName", 
            goal_details AS "goalDetails"`,
        [
          memberId, 
          goalName, 
          goalDetails
        ],
    );

    const goal = result.rows[0];

    return goal;
  }



  /** Find all goals.
   *
   * Returns [{ id, member_id, goal_name, goal_details}, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  goal_name AS "goalName", 
                  goal_details AS "goalDetails"
           FROM goals
           ORDER BY member_id`,
    );
   
    return result.rows;
  }

  /** Given an id, return data about a goal.
   *
   * Returns { }
   *
   * Throws NotFoundError if family not found.
   **/

  static async get(id) {
    const goalRes = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  goal_name AS "goalName", 
                  goal_details AS "goalDetails"
           FROM goals
           WHERE id = $1`,
        [id],
    );

    const goal = goalRes.rows[0];

    if (!goal) throw new NotFoundError(`No goal: ${id}`);

    return goal;
  }

 /** Delete given goal from database; returns undefined.
   *
   * Throws NotFoundError if goal not found.
   **/

 static async remove(id) {
  const result = await db.query(
        `DELETE
         FROM goals
         WHERE id = $1
         RETURNING id`,
      [id]);
  const goal = result.rows[0];

  if (!goal) throw new NotFoundError(`No goal: ${id}`);
}

}


module.exports = Goal;
