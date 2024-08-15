import express from 'express';
import * as companyController from '../controllers/company-controller.js';
const router = express.Router();


router.route("/")
    .get(companyController.index)
    .post(companyController.add)
    .put(companyController.update);

router.route("/:id").delete(companyController.remove);

export default router;