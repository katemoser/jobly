"use strict";

const db = require("../db")
const { BadRequestError, NotFoundError } = require("../expressError");
const { Job } = require("./job");



const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    job1Id,
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
    };

    //add with valid data
    test("works", async function () {
        let job = await Job.create(newJob);
        expect(job.id).toEqual(expect.any(Integer));
        expect(job).toEqual({ ...newJob, id: job.id });

        //make sure it's in the database
        const result = await db.query(
            `SELECT title, salary, equity, company_handle
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
    test("not work for adding invalid data", async function() {
        const badJob = {
            title: "badJob",
            salary: 5000,
        };
        try{
            const result = await Job.create(badJob);
            throw new Error("You shouldn't get here");
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** findAll */

describe("findAll", function () {
    //find all works NO FILTER
    test("works: no filter", async function () {
        let jobs = await Job.findAll();
        expect(jobs).toEqual(
            [{
                title: "testJob1",
                salary: 100000,
                equity: .1,
                companyHandle: "c1",
              },
              {
                title: "testJob2",
                salary: 20000,
                equity: .5,
                companyHandle: "c2",
              },
              {
                title: "testJob3",
                salary: 50000,
                equity: .01,
                companyHandle: "c2",
              }]
        );
    });
    //LATER: find all WITH FILTERS

});

/************************************** get */

describe("get", function () {
    //get company that exists
    test("works if job id exists", async function() {
        let result = await Job.get(job1Id);
        expect(result).toEqual({
            id: job1Id,
            title: "testJob1",
            salary: 100000,
            equity: .1,
            companyHandle: "c1",
          });
    });

    //not found if company doesn't exist
    test("not works if job id doesn't exist", async function() {
        try{
            await Job.get(0);
            throw new Error('Never throw this error!')
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
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