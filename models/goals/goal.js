"use strict";

const db = require("../../db");
const { sqlForPartialUpdate } = require("../../helpers/sql");

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
   * data should be { goalName, goalDetails }
   *
   * Returns { id, memberId, goalName, goalDetails }
   *
   *
   * */
   static async create({ goalName, goalDetails }, memberId) {
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
   * Returns { id, memberId, goalName, goalDetails }
   *
   * Throws NotFoundError if family not found.
   **/

  static async get(goalId, memberId) {
    const result = await db.query(
      `SELECT id,
              member_id AS "memberId"
        FROM goals
        WHERE id = $1`,
        [goalId]);
  
    const goalCheck = result.rows[0];
  
    //Check to see if goal exists by goalId in db
    if (!goalCheck) throw new NotFoundError(`No goal: ${goalId}`);
    //Confirm authorization: Check to see if memberId matches the goal member_id in db
    if (goalCheck.memberId !== memberId) throw new UnauthorizedError();

    const goalRes = await db.query(
          `SELECT id,
                  member_id AS "memberId",
                  goal_name AS "goalName", 
                  goal_details AS "goalDetails"
           FROM goals
           WHERE id = $1`,
        [goalId],
    );

    const goal = goalRes.rows[0];

    return goal;
  }

/** Update goal data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { goalName, goalDetails }
   *
   * Returns { id, memberId, goalName, goalDetails }
   *
   * Throws NotFoundError if not found.
   */

static async update(data, goalId, memberId) {
  const goalRes = await db.query(
    `SELECT id,
            member_id AS "memberId"
      FROM goals
      WHERE id = $1`,
      [goalId]);

  const goalCheck = goalRes.rows[0];

  //Check to see if goal exists by goalId in db
  if (!goalCheck) throw new NotFoundError(`No goal: ${goalId}`);
  //Confirm authorization: Check to see if memberId matches the goal member_id in db
  if (goalCheck.memberId !== memberId) throw new UnauthorizedError();

  const { setColumns, values } = sqlForPartialUpdate(data, {goalName: "goal_name", goalDetails: "goal_details"});

  /*'id' will be added to the end of the values and passed into the end of the db query as an array, 
  so the index of 'id' will be the length of values plus one*/
  const idVarIdx = "$" + (values.length + 1);

  const sqlQuery = `UPDATE goals
                    SET ${setColumns} 
                    WHERE id = ${idVarIdx} 
                    RETURNING id,
                              member_id AS "memberId",
                              goal_name AS "goalName", 
                              goal_details AS "goalDetails"`;
  
  const result = await db.query(sqlQuery, [...values, goalId]);
  const goal = result.rows[0];

  if (!goal) throw new NotFoundError(`No goal: ${goalId}`);

  return goal;
}


 /** Delete given goal from database; returns undefined.
   *
   * Throws NotFoundError if goal not found.
   **/

 static async remove(goalId, memberId) {
  const goalRes = await db.query(
    `SELECT id,
            member_id AS "memberId"
      FROM goals
      WHERE id = $1`,
      [goalId]);

  const goal = goalRes.rows[0];

  //Check to see if goal exists by goalId in db
  if (!goal) throw new NotFoundError(`No goal: ${goalId}`);
  //Confirm authorization: Check to see if memberId matches the goal member_id in db
  if (goal.memberId !== memberId) throw new UnauthorizedError();

  const result = await db.query(
        `DELETE
         FROM goals
         WHERE id = $1
         RETURNING id`,
      [goalId]);
  const deletedGoal = result.rows[0];

  return deletedGoal;
}

}


module.exports = Goal;
