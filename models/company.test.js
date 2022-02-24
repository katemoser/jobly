"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Company = require("./company.js");
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
  const newCompany = {
    handle: "new",
    name: "New",
    description: "New Description",
    numEmployees: 1,
    logoUrl: "http://new.img",
  };

  test("works", async function () {
    let company = await Company.create(newCompany);
    expect(company).toEqual(newCompany);

    const result = await db.query(
      `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'new'`);
    expect(result.rows).toEqual([
      {
        handle: "new",
        name: "New",
        description: "New Description",
        num_employees: 1,
        logo_url: "http://new.img",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Company.create(newCompany);
      await Company.create(newCompany);
      throw new Error("You shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let companies = await Company.findAll();
    expect(companies).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });


  // test findAll with filters

  // filter by the name
  test("works: filter by name", async function () {
    let query = {
      nameLike: "c"
    }
    const companies = await Company.findAll(query);
    expect(companies).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });

  test("works: filter by nameLike = '1', one result", async function () {
    let query = {
      nameLike: "1",
    }
    const companies = await Company.findAll(query);
    expect(companies).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    ]);
  });

  // filter by the minEmployees
  test("works: filter by minEmployees = '1', one result", async function () {
    let query = {
      minEmployees: 1,
    }
    const companies = await Company.findAll(query);
    expect(companies).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });

  // filter by the maxEmployees

  test("works: filter by maxEmployees = '2', two results", async function () {
    let query = {
      maxEmployees: 2,
    }
    const companies = await Company.findAll(query);
    expect(companies).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    ]);
  });

  // filter by the name and minEmployees
  test("works: filter by name and minEmployees", async function () {
    let query = {
      nameLike: "c2",
      minEmployees: 1,
    }
    const companies = await Company.findAll(query);
    expect(companies).toEqual([
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    ]);
  });

  // filter by the name and maxEmployees
  test("works: filter by name and maxEmployees", async function () {
    let query = {
      nameLike: "c2",
      maxEmployees: 3,
    }
    const companies = await Company.findAll(query);
    expect(companies).toEqual([
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    ]);
  });


  // filter by the name and minEmployees and maxEmployees
  test("works: filter by everything", async function () {
    let query = {
      nameLike: "c2",
      minEmployees: 1,
      maxEmployees: 3,
    }
    const companies = await Company.findAll(query);
    expect(companies).toEqual([
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    ]);
  });

  // filter by the minEmployees and maxEmployees
  test("works: filter by minEmployees and maxEmployees", async function () {
    let query = {
      minEmployees: 2,
      maxEmployees: 3,
    }
    const companies = await Company.findAll(query);
    expect(companies).toEqual([
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });
  // test invalid filter conditions

  // test minEmployees > maxEmployees -- will move to route
  // test("return error message: if minEmployees > maxEmployees", async function () {
  //   let query = {
  //     minEmployees: 3,
  //     maxEmployees: 2,
  //   }
  //   try {
  //     await Company.findAll(query);
  //     fail();
  //   } catch (err) {
  //     expect(err instanceof BadRequestError).toBeTruthy();
  //     expect(err.status).toEqual(400);
  //   }
  // });
  // test maxEmployees is too low
  test("return error message: maxEmployees is too low", async function () {
    let query = {
      maxEmployees: 0,
    }
    try {
      await Company.findAll(query);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
      expect(err.status).toEqual(400);
    }
  });
  // test minEmployees is too high
  test("return error message: minEmployees is too high", async function () {
    let query = {
      minEmployees: 4,
    }
    try {
      await Company.findAll(query);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
      expect(err.status).toEqual(400);
    }
  });
  // test nameLike doesn't exist
  test("return error message: nameLike doesn't exist", async function () {
    let query = {
      nameLike: "apple",
    }
    try {
      await Company.findAll(query);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
      expect(err.status).toEqual(400);
    }
  });

  //Invalid input -- try to query something that's not there
  //WILL CHECK IN ROUTE INSTEAD
  // test("Invalid input: return error message", async function(){
  //   let query = {
  //     happyEmployees: true,
  //   }
  //   try {
  //     await Company.findAll(query);
  //     fail()
  //   } catch (err){
  //     expect(err instanceof BadRequestError).toBeTruthy();
  //     expect(err.status).toEqual(400);
  //   }
  // } )


});


/************************************** getWhereClause */
describe("getWhereClause", function () {

  // one parameter "nameLike" pass in
  test("pass one parameter -- nameLike", function () {
    const query = {
      nameLike: "c", 
    }
    const result = Company.getWhereClause(query);
    expect(result).toEqual({
      whereClause: "name ILIKE $1",
      values: [`%${query.nameLike}%`],
    });
  });

  // one parameter "minEmployees" passed in
  test("pass one parameter -- minEmployees", function () {
    const query = {
      minEmployees: 10,
    }
    const result = Company.getWhereClause(query);
    expect(result).toEqual({
      whereClause: "num_employees >= $1",
      values: [query.minEmployees],
    });
  });
  // one parameter "maxEmployees" passed in

  test("pass one parameter -- maxEmployees", function () {
    const query = { maxEmployees: 10 }
    const result = Company.getWhereClause(query);
    expect(result).toEqual({
      whereClause: "num_employees <= $1",
      values: [query.maxEmployees],
    });
  });

  // two params: " min and max"
  test("pass two parameters -- minEmployees and maxEmployees", function () {
    const query = { maxEmployees: 10, minEmployees: 5 };
    const result = Company.getWhereClause(query);
    expect(result).toEqual({
      whereClause: "num_employees <= $1 AND num_employees >= $2",
      values: [query.maxEmployees, query.minEmployees],
    });
  });
  //two params: name and min
  test("pass two parameters -- nameLike and minEmployees", function () {
    const query = { nameLike: "apple", minEmployees: 5 };
    const result = Company.getWhereClause(query);
    expect(result).toEqual({
      whereClause: "name ILIKE $1 AND num_employees >= $2",
      values: [`%${query.nameLike}%`, query.minEmployees],
    });
  });
  //two params: name and max
  test("pass two parameters -- nameLike and maxEmployees", function () {
    const query = { nameLike: "apple", maxEmployees: 5 };
    const result = Company.getWhereClause(query);
    expect(result).toEqual({
      whereClause: "name ILIKE $1 AND num_employees <= $2",
      values: [`%${query.nameLike}%`, query.maxEmployees],
    });
  });

  // all three parameters passed in parameters
  test("pass all parameters -- nameLike, maxEmployees, minEmployees", function () {
    const query = {
      nameLike: "apple",
      minEmployees: 5,
      maxEmployees: 10,
    }
    const result = Company.getWhereClause(query);

    expect(result).toEqual({
      whereClause: `name ILIKE $1 AND num_employees >= $2 AND num_employees <= $3`,
      values: [`%${query.nameLike}%`, query.minEmployees, query.maxEmployees],
    });
  });



});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let company = await Company.get("c1");
    expect(company).toEqual({
      handle: "c1",
      name: "C1",
      description: "Desc1",
      numEmployees: 1,
      logoUrl: "http://c1.img",
    });
  });

  test("not found if no such company", async function () {
    try {
      await Company.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    name: "New",
    description: "New Description",
    numEmployees: 10,
    logoUrl: "http://new.img",
  };

  test("works", async function () {
    let company = await Company.update("c1", updateData);
    expect(company).toEqual({
      handle: "c1",
      ...updateData,
    });

    const result = await db.query(
      `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'c1'`);
    expect(result.rows).toEqual([{
      handle: "c1",
      name: "New",
      description: "New Description",
      num_employees: 10,
      logo_url: "http://new.img",
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      name: "New",
      description: "New Description",
      numEmployees: null,
      logoUrl: null,
    };

    let company = await Company.update("c1", updateDataSetNulls);
    expect(company).toEqual({
      handle: "c1",
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'c1'`);
    expect(result.rows).toEqual([{
      handle: "c1",
      name: "New",
      description: "New Description",
      num_employees: null,
      logo_url: null,
    }]);
  });

  test("not found if no such company", async function () {
    try {
      await Company.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Company.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Company.remove("c1");
    const res = await db.query(
      "SELECT handle FROM companies WHERE handle='c1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Company.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
