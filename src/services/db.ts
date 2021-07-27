import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQlite database.");
});

db.serialize(() => {
  db.run(`CREATE TABLE users 
        (id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL UNIQUE)`)
        .run(`CREATE TABLE connections 
            (user INTEGER NOT NULL, 
            userFriendWith INTEGER NOT NULL,
            PRIMARY KEY(user, userFriendWith))`)
        .run(`INSERT INTO users (name) 
            VALUES ('Bob'),
            ('Ashley'),
            ('Steve')`)
        .run(`INSERT INTO connections (user, userFriendWith) 
            VALUES (1, 2),
            (2, 1),
            (1, 3),
            (3, 1)`);
});

export const dbQueryFirst = async (query: string, params?: any[]) => {
  const res = await dbQuery(query, params);
  return res[0];
};

export const dbQuery = (query: string, params?: any[]) => {
  return new Promise<any[]>((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
