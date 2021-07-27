import { Request, Response } from "express";

import {
  badRequest,
  internalServerError,
  notFound,
  validateNumber,
} from "../services/utils";
import { User, usersModel } from "../models/users-model";

const listUsers = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    return res.json(await usersModel.listUsers());
  } catch (err) {
    return internalServerError(res, err);
  }
};

const getUserByID = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const id = parseInt(req.params.id);
  {
    if (!validateNumber(id)) return badRequest(res, "Invalid id");
  }

  try {
    let user = await usersModel.getUserByID(id);
    if (user) return res.json(user);
    else return notFound(res);
  } catch (err) {
    return internalServerError(res, err);
  }
};

const addUser = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const user = req.body as User;

  if (!user.name) return badRequest(res, "Info required");

  try {
    return res.json(await usersModel.insertUser(user));
  } catch (err) {
    return internalServerError(res, err);
  }
};

const getUserByConnections = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const id = parseInt(req.params.id);

  try {
    return res.json(await usersModel.getUsersByConnection(id));
  } catch (err) {
    return internalServerError(res, err);
  }
};

export const userController = {
  listUsers,
  getUserByID,
  addUser,
  getUserByConnections,
};
