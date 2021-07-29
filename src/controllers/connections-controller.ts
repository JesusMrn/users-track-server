import { Request, Response } from "express";

import { badRequest, internalServerError } from "../services/utils";
import { Connection, connectionsModel } from "../models/connections-model";
import { usersModel } from "../models/users-model";

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

  if (
    !connection.user ||
    !connection.userFriendWith ||
    connection.isMutual === undefined
  )
    return badRequest(res, "Info required");

  if (connection.isMutual != 0 && connection.isMutual != 1)
    return badRequest(
      res,
      "To mark a connection as mutual use '1' or '0' in the opposite case"
    );

  try {
    if (!(await usersModel.getUserByName(connection.user)))
      return badRequest(res, "User doesn't exist");
  } catch (err) {
    return internalServerError(res, err);
  }

  try {
    if (!(await usersModel.getUserByName(connection.userFriendWith)))
      return badRequest(res, "User which is friend with doesn't exist");
  } catch (err) {
    return internalServerError(res, err);
  }

  try {
    const aux = await connectionsModel.getConnectionByUsers(
      connection.user,
      connection.userFriendWith
    );

    if (aux && aux.isMutual === 1)
      return badRequest(res, "Connection already exist");
    else if (aux && connection.isMutual === 1 && aux.isMutual === 0)
      return res.json(await connectionsModel.makeConnectionMutual(aux));
  } catch (err) {
    return internalServerError(res, err);
  }

  try {
    const aux = await connectionsModel.getConnectionByUsers(
      connection.user,
      connection.userFriendWith
    );
    if (
      aux &&
      (aux.user === connection.user ||
        (aux.user === connection.userFriendWith && aux.isMutual))
    )
      return badRequest(res, "Connection already exist");
    else if (aux && aux.user === connection.userFriendWith && !aux.isMutual)
      return res.json(await connectionsModel.makeConnectionMutual(aux));
  } catch (err) {
    return internalServerError(res, err);
  }

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
