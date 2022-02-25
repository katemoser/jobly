"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs */

class Job {
  
  /** Create a job (from data), update db, return new job
   * 
   * data should be {title, salary, equity, company_handle}
   * 
   * Returns {id, title, salary, equity, companyHandle}
   * 
  **/
  static async create({title, salary, equity, companyHandle}){
    const result = await db.query(
      `INSERT INTO jobs(
          title,
          salary,
          equity,
          company_handle)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [
          title, 
          salary, 
          equity, 
          companyHandle
        ]  
    );
    const job = result.rows[0];
    if(!job) throw new BadRequestError("Could not create job");
    return job;
  }


  /** Find all jobs 
   * 
   * Returns [{id, title, salary, equity, companyHandle}]
  **/

  static async findAll(){
    const result = db.query(
      `SELECT id, title, salary, equity, company_handle AS 'companyHandle'
        FROM jobs`
    )
    const jobs = (await result).rows;
    if(!jobs) throw new NotFoundError("No jobs found");
    return jobs;
  }


  /** Get one job by Id
   * take job Id as input
   * Returns {id, title, salary, equity, companyHandle}
   * Throws NotFoundError if not found.
  **/

  static async get(id){
    const jobRes = await db.query(`
        SELECT id,
               title,
               salary,
               equity,
               company_handle AS "companyHandle"
            FROM jobs
            WHERE id=$1
        `, [id]);
    
    const job = jobRes.rows[0];
    
    if(!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }



  /** Update a job by Id, no change of the job Id, or the company 
   * 
   *  This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, company_handle}
   * Throws NotFoundError if not found.
  **/

  static async update(id, data){
    const { setCols, values } = sqlForPartialUpdate(data);

    const idIdx = "$" + (values.length + 1);

    const querySql = `
    UPDATE jobs
    SET ${setCols}
    WHERE id=${idIdx}
    RETURNING id, title, salary, equity, company_handle AS "companyHandle"
    `;

    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if(!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Delete a job by Id 
   * 
   * take job Id as input
   * Returns undefined
   * Throws NotFoundError if not found.
  */

  static async remove(id){
    const result = await db.query(
        `DELETE
            FROM jobs
            WHERE id = $1
            RETURNING id`,
            [id]
    );

    const job = result.rows[0];

    if(!job) throw new NotFoundError(`No job: ${id}`);
  }
}


module.exports = { Job };