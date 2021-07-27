import { Router, Application } from 'express';

import { usersRouter } from "./users-routes";
import { connectionsRouter } from "./connections-routes";

export const useRoutes = (app: Application) => {
    const apiRouter = Router();
    apiRouter.use('/users', usersRouter);
    apiRouter.use('/connections', connectionsRouter)

    app.use('/', apiRouter);
}