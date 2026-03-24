import { Router } from "express";
import userRouter from "./modules/user/user.routes.js";
import sensorsRouter from "./modules/sensors/sensor.routes.js";

const router = Router();

router.use("/user", userRouter);
router.use("/sensors", sensorsRouter);

export default router;
