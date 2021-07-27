import { Router } from "express";

import { connectionController } from "../controllers/connections-controller";

const connectionsRouter = Router();
connectionsRouter.get("", connectionController.listConnections);
connectionsRouter.post("", connectionController.addConnection);

export { connectionsRouter };
