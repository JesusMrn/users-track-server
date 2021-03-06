import { dbQuery, dbQueryFirst } from "../services/db";

export type User = {
  id: number;
  name: string;
};

const listUsers = async (): Promise<User[]> => {
  const res = await dbQuery(`SELECT * FROM users`);
  return res as User[];
};

const getUserById = async (id: number): Promise<User> => {
  const res = await dbQueryFirst(`SELECT * FROM users WHERE id = ?`, [id]);
  return res as User | undefined;
};

const getUserByName = async (name: string): Promise<User> => {
  const res = await dbQueryFirst(`SELECT * FROM users WHERE name = ?`, [name]);
  return res as User | undefined;
};

const insertUser = async (user: User): Promise<User> => {
  await dbQuery(`INSERT INTO users (name) VALUES (?)`, [user.name]);
  const res = await dbQuery(
    `SELECT seq AS id FROM sqlite_sequence WHERE  name = 'users'`
  );
  return await getUserById(res[0].id);
};

const getUsersFriends = async (name: string): Promise<User[]> => {
  const res = await dbQuery(
    `SELECT * FROM users WHERE name IN (SELECT userFriendWith FROM connections WHERE user = ?) OR name IN (SELECT user FROM connections WHERE userFriendWith = ? AND isMutual=1)`,
    [name, name]
  );
  return res as User[];
};

export type Stats = {
  id: number;
  name: string;
  friends: number;
};

const getNumberOfFriends = async (user: User): Promise<Stats> => {
  const res = await dbQueryFirst(
    `SELECT COUNT(*) as friends FROM users WHERE name IN (SELECT userFriendWith FROM connections WHERE user = ?) OR name IN (SELECT user FROM connections WHERE userFriendWith = ? AND isMutual=1)`,
    [user.name, user.name]
  );
  const aux = { id: user.id, name: user.name, friends: res.friends };
  return aux as Stats;
};

const getStats = async (users: User[]): Promise<Stats[]> => {
  const res = await Promise.all(
    users.map(async (user) => {
      return await getNumberOfFriends(user);
    })
  );
  return res as Stats[];
};

export const usersModel = {
  listUsers,
  getUserById,
  getUserByName,
  insertUser,
  getUsersFriends,
  getStats,
};
