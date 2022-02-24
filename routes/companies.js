"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Company = require("../models/company");

const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();


/** POST / { company } =>  { company }
 *
 * company should be { handle, name, description, numEmployees, logoUrl }
 *
 * Returns { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: login
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, companyNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const company = await Company.create(req.body);
  return res.status(201).json({ company });
});

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 *    - if min > max, return 400 error
 * - nameLike (will find case-insensitive, partial matches)
 *    if not found, return 400 bad request
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  console.log("WE HIT ENDPOINT", req.query);
  //throw new BadRequestError("INVALID QUERY");
  console.log("req.query: ", req.query);
  let companies;
  if (Object.keys(req.query).length > 0) {

    if(validateQuery(req.query)){
      companies = await Company.findAll(req.query);
    } else{
      //throw new BadRequestError();
    }
  } else {
   companies = await Company.findAll();
  }
  return res.json({ companies });
});

/**Helper function */
function validateQuery(query) {
  const queryKeys = ["nameLike", "minEmployees", "maxEmployees"];
  const hasValidKeys = Object.keys(query).every(key => queryKeys.includes(key));

  //TODO: REFACTOR TO SWITCH??
  if (hasValidKeys) {
    if (query.minEmployees && !parseInt(query.minEmployees)) {
      throw new BadRequestError("Incorrect type for minEmployees");
    }
    if (query.maxEmployees && !parseInt(query.maxEmployees)) {

      throw new BadRequestError("Incorrect type for maxEmployees");
    }
    if ((query.minEmployees && query.maxEmployees) && (query.minEmployees > query.maxEmployees)) {

      throw new BadRequestError("Minimum number of employees must less than or equal to max");
    }
    return true;
  } else {
    //return false;

    throw new BadRequestError("Invalid query paramters");
  }
  //return true;
}



/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  const company = await Company.get(req.params.handle);
  return res.json({ company });
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: login
 */

router.patch("/:handle", ensureLoggedIn, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, companyUpdateSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const company = await Company.update(req.params.handle, req.body);
  return res.json({ company });
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: login
 */

router.delete("/:handle", ensureLoggedIn, async function (req, res, next) {
  await Company.remove(req.params.handle);
  return res.json({ deleted: req.params.handle });
});


module.exports = router;
