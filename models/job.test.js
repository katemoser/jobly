"use strict";

const db = require("../db")
const { BadRequestError, NotFoundError } = require("../expressError");
const { Job } = require("./job");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newJob = {
        title: "newJob",
        salary: 60000,
        equity: .05,
        companyHandle: "c3",
    }

    //add with valid data
    test("works", async function () {
        let job = await Job.create(newJob);
        expect(job.id).toEqual(expect.any(Integer));
        expect(job).toEqual({ ...newJob, id: job.id });

        //make suure it's in the database
        const result = await db.query(
            `SELECT title, slary, equity, company_handle
                FROM jobs
                WHERE id = ${job.id}`
        );
        expect(result.rows[0]).toEqual({
            title: "newJob",
            salary: 60000,
            equity: .05,
            companyHandle: "c3",
        });
    });

    //add with invalid data
    //add with duplicate

});

/************************************** findAll */

describe("findAll", function () {
    //find all works NO FILTER

    //LATER: find all WITH FILTERS

});

/************************************** get */

describe("get", function () {
    //get company that exists
    //not found if company doesn't exist

});

/************************************** update */

describe("update", function () {
    //successful update for all fields
    //works with some (null) fields
    // not found no such company
    //bad request no data

});

/************************************** delete */

describe("remove", function () {
    //successful delete
    //not found if no such id
})