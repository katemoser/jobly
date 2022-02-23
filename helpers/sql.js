"use strict";

const { BadRequestError } = require("../expressError");

/** It takes two objects as the parameters, first params is about the data that 
 * need to update, the second is conversion from the JavaScript object key's 
 * name(camelCase) to database column's name(snake_case).
 * 
 * input: ({firstName: 'Aliya', age: 32}, {firstName: "first_name", age: "age"})
 * 
 * returns : 
 * {
    setCols: '"first_name"=$1, "age"=$2',
    values: ['Aliya', 32],
  }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
