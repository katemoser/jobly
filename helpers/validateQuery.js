"use strict";

const {BadRequestError} = require("../expressError");
/**Take the query object, chech whether the keys and values are valid
 * {
 * nameLike: "c",
 * minEmployees: 1,
 * maxEmployees: 3}
 * 
 * return: true or throw errors if keys and values are not valid
  */
function validateQuery(query) {
    const queryKeys = ["nameLike", "minEmployees", "maxEmployees"];
    const hasValidKeys = Object.keys(query).every(key => queryKeys.includes(key));

    if (hasValidKeys) {

        // Try: Json schema to verify the data
        if (query.minEmployees && !Number(query.minEmployees)) {
            throw new BadRequestError("Incorrect type for minEmployees");
        }
        if (query.maxEmployees && !Number(query.maxEmployees)) {

            throw new BadRequestError("Incorrect type for maxEmployees");
        }
        if ((query.minEmployees
            && query.maxEmployees)
            && (Number(query.minEmployees) > Number(query.maxEmployees))) {

            throw new BadRequestError(
                "Minimum number of employees must less than or equal to max"
            );
        }
        return true;
    } else {
        throw new BadRequestError("Invalid query paramters");
    }
}

module.exports = { validateQuery };