"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Company {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ handle, name, description, numEmployees, logoUrl }) {
    const duplicateCheck = await db.query(
      `SELECT handle
           FROM companies
           WHERE handle = $1`,
      [handle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${handle}`);

    const result = await db.query(
      `INSERT INTO companies(
          handle,
          name,
          description,
          num_employees,
          logo_url)
           VALUES
             ($1, $2, $3, $4, $5)
           RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
      [
        handle,
        name,
        description,
        numEmployees,
        logoUrl,
      ],
    );
    const company = result.rows[0];

    return company;
  }

  /** Find all companies.
   * 
   * Optional filter functionality. 
   * Can be pass following parameters:
   *      nameLike
   *      minEmployees
   *      maxEmployees
   * 
   * takes object like : {nameLike, minEmployees, maxEmployees}
   * 
   * calls getWhereClause(query string params) 
   * to get where clause for SQL command
   *
   * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
   * */

  static async findAll(queryStringParams) {
    if (queryStringParams) {

      let result = Company.getWhereClause(queryStringParams);
      const companiesRes = await db.query(
        `SELECT handle,
                name,
                description,
                num_employees AS "numEmployees",
                logo_url AS "logoUrl"
           FROM companies
           WHERE ${result.whereClause}
           ORDER BY name`, result.values);
      return companiesRes.rows;
    }

    const companiesRes = await db.query(
      `SELECT handle,
                name,
                description,
                num_employees AS "numEmployees",
                logo_url AS "logoUrl"
           FROM companies
           ORDER BY name`);
    return companiesRes.rows;
  }



  /** Function for generating WHERE clause for 
   * SQL command in findAll() {with filter!}
   * 
   * takes: an object where keys are names of query
   * string parameters, and values are user inputs
   *                  like { nameLike : "apple",
   *                         minEmployees: 10,
   *                         maxEmployees: 20,}
   * 
   * RETURNS: Object of where clause string, 
   * and array of values for $1, etc
   * 
   * like: {whereClause : "numEmployees <= $1 AND numEmployees >= $2",
   *        values:  [maxEmployees, minEmployees]} 
   * 
   *  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
   */
  static getWhereClause(queryStringParams) {
    let keys = Object.keys(queryStringParams);

    let whereClause = "";
    let values = [];
    let idx = 0;
    for (let key of keys) {
      if (idx > 0) {
        whereClause.concat(" AND ");
      }
      if (key === "nameLike") {
        whereClause.concat(`name ILIKE $${idx++}`);
        values.push(`%${queryStringParams[key]}%`);
      }

      if (key === "minEmployees") {
        whereClause.concat(`numEmployees >= $${idx++}`);
        values.push(queryStringParams[key]);
      }

      if (key === "maxEmployees") {
        whereClause.concat(`numEmployees <= $${idx++}`);
        values.push(queryStringParams[key]);
      }

      return {
        whereClause,
        values,
      };
    }





  //NOTE: let's make a seperate function that creates a string for our 
  //WHERE clause for our sql command

  //ALSO: doc strings

  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const companyRes = await db.query(
      `SELECT handle,
                name,
                description,
                num_employees AS "numEmployees",
                logo_url AS "logoUrl"
           FROM companies
           WHERE handle = $1`,
      [handle]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        numEmployees: "num_employees",
        logoUrl: "logo_url",
      });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `
      UPDATE companies
      SET ${setCols}
        WHERE handle = ${handleVarIdx}
        RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`;
    const result = await db.query(querySql, [...values, handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(handle) {
    const result = await db.query(
      `DELETE
           FROM companies
           WHERE handle = $1
           RETURNING handle`,
      [handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
  }
}


module.exports = Company;
