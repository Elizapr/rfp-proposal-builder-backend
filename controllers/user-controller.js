import initKnex from "knex";
import configuration from "../knexfile.js";
import { v4 as uuid } from "uuid";
const knex = initKnex(configuration);
function isValidEmail(email) {
    // Regular expression for validating email addresses
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
const index = async (_req, res) => {
    try {
        const data = await knex("user");
        res.status(200).json(data);
    } catch (err) {
        res.status(400).send(`Error retrieving Users: ${err}`);
    }
};

const add = async (req, res) => {
    const { email, password, contact } = req.body;
    const newUser = {
        id: uuid(),
        email,
        password,
        contact
    };
    if (!email || !password) {
        return res.status(400).json({
            email: "Please provide all information in the request",
            password: "Please provide all information in the request",
        });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({
            email: "Please provide valid email address in the request",
        });
    }

    try {
        const doesUserExist = await knex("user").where("email", email);
        if (doesUserExist.length > 0) {
            return res.status(400).json({
                email: "User already exists",
            });
        }

        const result = await knex("user").insert(newUser).returning("id");
        console.log(result);
        const createdUser = await knex("user").where({
            id: result[0],
        });
        res.status(201).json(createdUser);
    } catch (error) {
        res.status(500).json({
            message: `Unable to create new user: ${error}`,
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            email: "Please provide all information in the request",
            password: "Please provide all information in the request",
        });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({
            email: "Please provide valid email address in the request",
            password: "Please provide valid email address in the request",
        });
    }
    try {
        const userData = await knex("user").where("email", email);
        if (userData.length === 0) {
            return res.status(400).json({
                email: "User does not exist",
            });
        }
        if (userData[0].password !== password) {
            return res.status(400).json({
                password: "Password does not match",
            });
        }
        res.status(200).json(
            {
                user_id: userData[0].id,
                message: "Successfully logged in"
            }
        );
    } catch (error) {
        res.status(500).json({
            email: `Unable to find user: ${error}`,
        });
    }
};

const remove = async (req, res) => {
    try {
        const userDeleted = await knex("user")
            .where({ id: req.params.id })
            .delete();

        if (userDeleted === 0) {
            return res
                .status(404)
                .json({ message: `User with ID ${req.params.id} not found` });
        }

        // No Content response
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            message: `Unable to delete user: ${error}`,
        });
    }
};

const update = async (req, res) => {
    try {
        const { id, email, contact } =
            req.body;
        console.log("reqest body", req.body);
        if (!email || !password) {
            return res.status(400).json({
                email: "Missing informations",
                password: "Missing informations",
            });
        }

        const user = await knex("user")
            .where({ id: id })
            .first();
        if (!user) {
            return res.status(400).json({ email: "User does not exist" });
        }

        const rowsUpdated = await knex("user")
            .where({
                id: id,
            })
            .update({
                email,
                contact,
            });

        if (rowsUpdated === 0) {
            return res.status(404).json({ email: `User ID is not found` });
        }
        const updatedUser = await knex("user")
            .where({
                "id": id,
            })
            .first();
        res.status(200).json(updatedUser[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { index, add, login, remove, update };