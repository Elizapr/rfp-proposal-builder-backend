import express from 'express';
import * as employeeController from '../controllers/employee-controller.js';
const router = express.Router();


router.route("/")
    .post(employeeController.add)


router.route("/:company_id/employees").get(employeeController.index);

router.route("/:id")
    .get(employeeController.findSingleEmployee)
    .put(employeeController.update)
    .delete(employeeController.remove);

export default router;