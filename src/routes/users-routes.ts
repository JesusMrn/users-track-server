import { Router } from "express";

import { userController } from "../controllers/users-controller";

const usersRouter = Router();
usersRouter.get("", userController.listUsers);
usersRouter.get("/:id", userController.getUserByID);
usersRouter.post("", userController.addUser);
usersRouter.get("/:id/connections", userController.getUserByConnections);

export { usersRouter };
