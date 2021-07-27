# users-track-server
Server side of an user-track app

## Previous steps
Don't forget to `npm i` before start the server.

To start the server run `npm run start`.

To just build it run `npm run build`.

When the server starts, automatically a database is created in memory and some data is inserted in order to test.

## Endpoints

### Users:
#### Get all users:
  GET http://localhost:3000/users

#### Get a user by id:
GET http://localhost:3000/users/{id}

#### Get all users connected with:
GET http://localhost:3000/users/{id}/connections


#### Add a new user (name is unique):
POST http://localhost:3000/users

Content-Type: application/json  
Parameters:
* id: number (no needed since it's self-generated and self-incremented)
* name: string

NOTE.
In post-man you must choose body -> x-www-form-urlencoded to pass the information.

### Connections
#### Get all connections:
GET http://localhost:3000/connections

#### Add a new connection (bidirectional):
POST http://localhost:3000/connections

Content-Type: application/json  
Parameters:
* user: number
* userFriendWith: number

NOTE.
In both cases it is necessary to send the user's id
