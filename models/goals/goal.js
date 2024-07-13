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

 

}


module.exports = Goal;
