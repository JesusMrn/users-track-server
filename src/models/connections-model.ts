import { dbQuery, dbQueryFirst } from "../services/db";

export type Connection = {
  user: number;
  userFriendWith: number;
};

const listConnections = async (): Promise<Connection[]> => {
  const res = await dbQuery(`SELECT * FROM connections`);
  return res as Connection[];
};

const getConnection = async (
  user: number,
  userFriendWith: number
): Promise<Connection> => {
  const res = await dbQueryFirst(
    `SELECT * FROM connections WHERE user = ? AND userFriendWith = ?`,
    [user, userFriendWith]
  );
  return res as Connection | undefined;
};

const insertConnection = async (
  connection: Connection
): Promise<Connection> => {
  const res = await dbQuery(
    `INSERT INTO connections (user, userFriendWith) VALUES (?,?), (?,?)`,
    [
      connection.user,
      connection.userFriendWith,
      connection.userFriendWith,
      connection.user,
    ]
  );
  return await getConnection(connection.user, connection.userFriendWith);
};

export const connectionsModel = {
  listConnections,
  insertConnection,
};
