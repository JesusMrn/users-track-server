import { Router } from "express";

import { userController } from "../controllers/users-controller";

const usersRouter = Router();
usersRouter.get("", userController.listUsers);
usersRouter.get("/:id", userController.getUserById);
usersRouter.post("", userController.addUser);
usersRouter.get("/:id/connections", userController.getUsersFriends);
usersRouter.get("/get/stats", userController.getUsersStats);

export { usersRouter };
