import AuthMiddleware from "../../shared/middlewares/auth.middleware.js";
import UserControllers from "./user.controller.js";

import { Router } from "express";
const userRouter = Router();

userRouter.post(
    "/cadastrar",
    UserControllers.cadastrar
);

userRouter.post("/session", UserControllers.refreshSession);

userRouter.post(
    "/logout",
    AuthMiddleware.authanticateAccess,
    UserControllers.logout
);

userRouter.post("/login", UserControllers.login);

userRouter.post(
    "/generatekeyregister",
    AuthMiddleware.authanticateAccess,
    AuthMiddleware.verifyRole(["admin"]),
    UserControllers.generateKeyRegister
);

userRouter.get(
    "/usuarios", //?id=Number
    AuthMiddleware.authanticateAccess,
    AuthMiddleware.verifyRole(["admin"]),
    UserControllers.getUsuarios
);

export default userRouter;
