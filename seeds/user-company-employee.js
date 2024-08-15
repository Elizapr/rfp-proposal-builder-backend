// import seed data files, arrays of objects
import userData from "../seed-data/user.js";
import companyData from "../seed-data/company.js";
import employeeData from "../seed-data/employee.js";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex("employee").del();
    await knex("company").del();
    await knex("user").del();
    await knex("user").insert(userData);
    await knex("company").insert(companyData);
    await knex("employee").insert(employeeData);
}
