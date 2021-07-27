import { dbQuery, dbQueryFirst } from "../services/db";

export type User = {
  id: number;
  name: string;
};

const listUsers = async (): Promise<User[]> => {
  const res = await dbQuery(`SELECT * FROM users`);
  return res as User[];
};

const getUserByID = async (id: number): Promise<User> => {
  const res = await dbQueryFirst(`SELECT * FROM users WHERE id = ?`, [id]);
  return res as User | undefined;
};

const getUserByName = async (name: string): Promise<User> => {
  const res = await dbQueryFirst(`SELECT * FROM users WHERE name = ?`, [name]);
  return res as User | undefined;
};

const insertUser = async (user: User): Promise<User> => {
  await dbQuery(`INSERT INTO users (name) VALUES (?)`, [user.name]);
  return await getUserByName(user.name);
};

const getUsersByConnection = async (id: number): Promise<User[]> => {
  const res = await dbQuery(
    `SELECT * FROM users WHERE id IN (SELECT userFriendWith FROM connections WHERE user = ?)`,
    [id]
  );
  return res as User[];
};

export const usersModel = {
  listUsers,
  getUserByID,
  getUserByName,
  insertUser,
  getUsersByConnection,
};
