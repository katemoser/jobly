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
   * Returns {id, title, salary, equity, company_handle}
   * 
   * Throws BadRequestError if job already in database.
  **/


  /** Find all jobs 
   * 
   * Returns [{id, title, salary, equity, company_handle}]
  **/


  /** Get one job by Id
   * take job Id as input
   * Returns {id, title, salary, equity, company_handle}
   * Throws NotFoundError if not found.
  **/



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

  /** Delete a job by Id 
   * 
   * take job Id as input
   * Returns undefined
   * Throws NotFoundError if not found.
  */

}