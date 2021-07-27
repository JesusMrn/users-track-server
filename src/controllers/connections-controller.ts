import { Request, Response } from "express";

import {
  badRequest,
  internalServerError,
} from "../services/utils";
import { Connection, connectionsModel } from "../models/connections-model";

const listConnections = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    return res.json(await connectionsModel.listConnections());
  } catch (err) {
    return internalServerError(res, err);
  }
};

const addConnection = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const connection = req.body as Connection;

  if (!connection.user || !connection.userFriendWith) return badRequest(res, "Info required");

  try {
    return res.json(await connectionsModel.insertConnection(connection));
  } catch (err) {
    return internalServerError(res, err);
  }
};

export const connectionController = {
  listConnections,
  addConnection,
};
