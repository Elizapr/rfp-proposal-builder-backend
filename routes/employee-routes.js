import express from 'express';
import * as employeeController from '../controllers/employee-controller.js';
const router = express.Router();


router.route("/")
    .get(employeeController.index)
    .post(employeeController.add)
    .put(employeeController.update);

router.route("/:id").delete(employeeController.remove);

export default router;