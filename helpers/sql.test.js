"use strict";

const {BadRequestError} = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

//What to test:


describe("sqlForPartialUpdate", function(){
    const dataToUpdate = {
        firstName: 'Aliya', 
        age: 32,
    };
    const jsToSql = {
        firstName : "first_name",
        age : "age",
    };

    const allSnakeData = {
        age: 32,
    }

    //test with valid data
    //should return object with string 
    //for query and array of new values
    test("valid input", function(){
        let result = sqlForPartialUpdate(dataToUpdate, jsToSql);
        expect(result).toEqual({
            setCols: '"first_name"=$1, "age"=$2',
            values: ['Aliya', 32],
          });
    });
    //test with invalid data (empty object)
    //should return bad request error 
    test("invalid input -- empty object", function(){
        try{
            let result = sqlForPartialUpdate({}, jsToSql);
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
            expect(err.status).toEqual(400);
            expect(err.message).toEqual("No data");
        }
        //expect(result.message).toEqual("No data");
        //console.error("RESULT: ", result)
        //expect(result.status).toEqual(400);
    });

    //test for empty jsToSql -- should still work
    test("Empty jsToSql Object -- should still work", function(){
        let result = sqlForPartialUpdate(allSnakeData, {});
        expect(result).toEqual({
            setCols: '"age"=$1',
            values: [32],
        })

    })
});