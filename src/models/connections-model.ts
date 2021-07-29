import { dbQuery, dbQueryFirst } from "../services/db";

export type Connection = {
  id: number;
  user: string;
  userFriendWith: string;
  isMutual: number;
};

const listConnections = async (): Promise<Connection[]> => {
  const res = await dbQuery(`SELECT * FROM connections`);
  return res as Connection[];
};

const getConnectionByUsers = async (
  user: string,
  userFriendWith: string
): Promise<Connection> => {
  const res = await dbQueryFirst(
    `SELECT * FROM connections WHERE (user = ? AND userFriendWith = ?) OR (user = ? AND userFriendWith = ?)`,
    [user, userFriendWith, userFriendWith, user]
  );
  return res as Connection | undefined;
};

const getConnectionById = async (id: number): Promise<Connection> => {
  const res = await dbQueryFirst(`SELECT * FROM connections WHERE id = ?`, [
    id,
  ]);
  return res as Connection | undefined;
};

const insertConnection = async (
  connection: Connection
): Promise<Connection> => {
  await dbQuery(
    `INSERT INTO connections (user, userFriendWith, isMutual) VALUES (?,?,?)`,
    [connection.user, connection.userFriendWith, connection.isMutual]
  );

  const res = await dbQuery(
    `SELECT seq AS id FROM sqlite_sequence WHERE  name = 'connections'`
  );
  return await getConnectionById(res[0].id);
};

const makeConnectionMutual = async (
  connection: Connection
): Promise<Connection> => {
  await dbQuery(`UPDATE connections SET isMutual = 1 WHERE id = ?`, [
    connection.id,
  ]);

  return await getConnectionById(connection.id);
};

export const connectionsModel = {
  listConnections,
  getConnectionByUsers,
  insertConnection,
  makeConnectionMutual,
};
