const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Aliya', age: 32} =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
    //FIRST--> get the names of the columns you are going to update in your sql statement
  const keys = Object.keys(dataToUpdate);
  //handle case if dataToUpdate didn't include any data in the object
  if (keys.length === 0) throw new BadRequestError("No data");


  //THEN map over those keys to get your SQL statement to correlate with the appropriate INDEX of the VALUES
  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const columns = keys.map((columnName, idx) =>
    //check to see if column names have a sql version first... for example firstName would become first_name
    //otherwise it will just use the js column name if it is only one word... like "age" or "name"
    //the index is offset by +1 because the sql update statement index does not start at 0 like in javascript.
      `"${jsToSql[columnName] || columnName}"=$${idx + 1}`,
  );

  return {
    setColumns: columns.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
