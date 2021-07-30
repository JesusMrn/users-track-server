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

const getUserById = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const id = parseInt(req.params.id);
  {
    if (!validateNumber(id)) return badRequest(res, "Invalid id");
  }

  try {
    let user = await usersModel.getUserById(id);
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
    const aux = await usersModel.getUserByName(user.name);
    if (aux) return badRequest(res, "Name already taken");
    else return res.json(await usersModel.insertUser(user));
  } catch (err) {
    return internalServerError(res, err);
  }
};

const getUsersFriends = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const user = await usersModel.getUserById(parseInt(req.params.id));
    if (!user) return badRequest(res, "User doesn't exist");
    return res.json(await usersModel.getUsersFriends(user.name));
  } catch (err) {
    return internalServerError(res, err);
  }
};

const getUsersStats = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  let users: User[];
  try {
    users = await usersModel.listUsers();
  } catch (err) {
    return internalServerError(res, err);
  }

  try {
    return res.json(await usersModel.getStats(users));
  } catch (err) {
    return internalServerError(res, err);
  }
};

export const userController = {
  listUsers,
  getUserById,
  addUser,
  getUsersFriends,
  getUsersStats,
};
