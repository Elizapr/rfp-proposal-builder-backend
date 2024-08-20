import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
    try {
        const data = await knex("company");
        res.status(200).json(data);
    } catch (err) {
        res.status(400).send(`Error retrieving Companies: ${err}`);
    }
};

const findSingleCompany = async (_req, res) => {
    try {
        const data = await knex("company").where({
            user_id: _req.params.user_id,
        });
        console.log(data[0])
        res.status(200).json(data[0]);
    } catch (err) {
        res.status(400).send(`Error retrieving Employees: ${err}`);
    }
};
const findCompanyAndEmployees = async (_req, res) => {
    try {
        const data = await knex("company")
            .where({
                user_id: _req.params.user_id,
            });
        const employees = await knex
            .select("employee.full_name", "employee.skills", "employee.job_title", "employee.experience_years")
            .from("employee")
            .where({
                company_id: data[0].id,
            })
        console.log(data[0])
        res.status(200).json({ ...data[0], 'employees': employees });
    } catch (err) {
        res.status(400).send(`Error retrieving Employees: ${err}`);
    }
};
const add = async (req, res) => {
    const { name, industry, founded, city, state, country, background, user_id } = req.body;
    const newCompany = {
        name,
        industry,
        founded,
        city,
        state,
        country,
        background,
        user_id
    };
    if (!name || !industry || !founded || !city || !state || !country || !background || !user_id) {
        return res.status(400).json({
            message: "Please provide all information in the request",
        });
    }

    try {
        const doesCompanyExist = await knex("company").where("name", name);
        if (doesCompanyExist.length > 0) {
            return res.status(400).json({
                message: "Company already exists",
            });
        }

        const result = await knex("company").insert(newCompany).returning("id");;
        const createdCompany = await knex("company").where({
            id: result[0],
        });
        res.status(201).json(createdCompany);
    } catch (error) {
        res.status(500).json({
            message: `Unable to create new company: ${error}`,
        });
    }
};

const remove = async (req, res) => {
    try {
        const deleted = await knex("company")
            .where({ id: req.params.id })
            .delete();

        if (deleted === 0) {
            return res
                .status(404)
                .json({ message: `Company with ID ${req.params.id} not found` });
        }

        // No Content response
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            message: `Unable to delete company: ${error}`,
        });
    }
};

const update = async (req, res) => {
    try {
        const { name, industry, founded, city, state, country, background } =
            req.body;
        console.log("reqest body", req.body);
        if (!name || !industry || !founded || !city || !state || !country || !background) {
            return res.status(400).json({
                message: "Missing informations",
            });
        }

        const data = await knex("company")
            .where({ id: req.params.company_id })
            .first();
        if (!data) {
            return res.status(400).json({ message: "Company does not exist" });
        }

        const rowsUpdated = await knex("company")
            .where({
                id: req.params.company_id,
            })
            .update({
                name,
                industry,
                founded,
                city,
                state,
                country,
                background
            });

        if (rowsUpdated === 0) {
            return res.status(404).json({ message: `Company ID is not found` });
        }
        const updatedData = await knex("company")
            .where({
                "id": req.params.company_id,
            })
            .first();
        res.status(200).json(updatedData[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { index, add, remove, update, findSingleCompany, findCompanyAndEmployees };