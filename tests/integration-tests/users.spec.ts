import request from "supertest";

const app = require("../../src/index");
import { connectionsModel } from "../../src/models/connections-model";
import { usersModel } from "../../src/models/users-model";

describe("Integration tests for users", () => {
  describe("GET /users", () => {
    it("Return list of users", async () => {
      const res = await usersModel.listUsers();
      return request(app)
        .get("/users")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect(JSON.stringify(res));
    });
  });

  describe("GET a single user by id", () => {
    it("Return the user which have the same id passed as parameter", async () => {
      const res = await usersModel.getUserById(2);
      return request(app)
        .get("/users/2")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect(JSON.stringify(res));
    }),
      it("Try get a user which does not exist return Not Found", async () => {
        return request(app).get("/users/221").expect(404);
      }),
      it("Do not accept invalid ids", async () => {
        return request(app)
          .get("/users/-2")
          .expect(400)
          .expect("Content-Type", /json/)
          .expect({ err: "Invalid id" });
      });
  });

  describe("GET user connections", () => {
    it("return list of users which the given user is connected with", async () => {
      const res = await usersModel.getUsersFriends("Bob");
      return request(app)
        .get("/users/1/connections")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect(JSON.stringify(res));
    }),
      it("Non existing user return error", async () => {
        return request(app)
          .get("/users/1012/connections")
          .expect(400)
          .expect("Content-Type", /json/)
          .expect({ err: "User doesn't exist" });
      });
  });

  describe("GET users stats", () => {
    it("return list of users", async () => {
      const aux = await usersModel.listUsers();
      const res = await usersModel.getStats(aux);
      return request(app)
        .get("/users/get/stats")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect(JSON.stringify(res));
    });
  });

  describe("POST /users", () => {
    it("Successful POST return the new user", async () => {
      const index = (await usersModel.listUsers()).length + 1;
      return request(app)
        .post("/users")
        .send({ id: 1, name: "Marta" })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect('{"id":' + index + ',"name":"Marta"}');
    }),
      it('Do not pass any info to POST return 400 with "Info required" text', () => {
        return request(app)
          .post("/users")
          .send(undefined)
          .expect(400)
          .expect("Content-Type", /json/)
          .expect({ err: "Info required" });
      }),
      it("Can not add a user which already exist", () => {
        return request(app)
          .post("/users")
          .send({ id: 1, name: "Bob" })
          .expect(400)
          .expect("Content-Type", /json/)
          .expect({ err: "Name already taken" });
      });
  });
});
