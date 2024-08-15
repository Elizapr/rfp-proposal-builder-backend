import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
    try {
        const data = await knex("employee");
        res.status(200).json(data);
    } catch (err) {
        res.status(400).send(`Error retrieving Employees: ${err}`);
    }
};

const add = async (req, res) => {
    const { full_name, skills, job_title, experience_years, company_id } = req.body;
    const newEmployee = {
        full_name,
        skills,
        job_title,
        experience_years,
        company_id
    };
    if (!full_name || !skills || !job_title || !experience_years || !company_id) {
        return res.status(400).json({
            message: "Please provide all information in the request",
        });
    }

    try {
        const doesExist = await knex("employee").where("full_name", full_name);
        if (doesExist.length > 0) {
            return res.status(400).json({
                message: "Employee already exists",
            });
        }

        const result = await knex("employee").insert(newEmployee);
        const createdEmployee = await knex("employee").where({
            id: result[0],
        });
        res.status(201).json(createdEmployee);
    } catch (error) {
        res.status(500).json({
            message: `Unable to create new employee: ${error}`,
        });
    }
};

const remove = async (req, res) => {
    try {
        const deleted = await knex("employee")
            .where({ id: req.params.id })
            .delete();

        if (deleted === 0) {
            return res
                .status(404)
                .json({ message: `Employee with ID ${req.params.id} not found` });
        }

        // No Content response
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            message: `Unable to delete employee: ${error}`,
        });
    }
};

const update = async (req, res) => {
    try {
        const { id, full_name, skills, job_title, experience_years, company_id } =
            req.body;
        console.log("reqest body", req.body);
        if (!full_name || !skills || !job_title || !experience_years || !company_id) {
            return res.status(400).json({
                message: "Missing informations",
            });
        }

        const data = await knex("employee")
            .where({ id: id })
            .first();
        if (!data) {
            return res.status(400).json({ message: "Employee does not exist" });
        }

        const rowsUpdated = await knex("employee")
            .where({
                id: id,
            })
            .update({
                full_name,
                skills,
                job_title,
                experience_years,
                company_id
            });

        if (rowsUpdated === 0) {
            return res.status(404).json({ message: `Employee ID is not found` });
        }
        const updatedData = await knex("employee")
            .where({
                "id": id,
            })
            .first();
        res.status(200).json(updatedData[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { index, add, remove, update };