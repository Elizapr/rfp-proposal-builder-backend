import express from 'express';
import * as usercontroller from '../controllers/user-controller.js';
const router = express.Router();


router.route("/")
    .get(usercontroller.index)
    .post(usercontroller.add)
    .put(usercontroller.update);

router.route("/:id").delete(usercontroller.remove);

router.route("/login").post(usercontroller.login);

export default router;