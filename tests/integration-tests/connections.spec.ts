import request from "supertest";

const app = require("../../src/index");
import { connectionsModel } from "../../src/models/connections-model";

describe("Integration tests for connections", () => {
  describe("GET /connections", () => {
    it("return list of connections", async () => {
      const res = await connectionsModel.listConnections();
      return request(app)
        .get("/connections")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect(JSON.stringify(res));
    });
  });

  describe("POST /connections", () => {
    it("Successful POST return the new user", async () => {
      const index = (await connectionsModel.listConnections()).length + 1;
      return request(app)
        .post("/connections")
        .send({ user: "Pepe", userFriendWith: "Steve", isMutual: 1 })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect(
          '{"id":' +
            index +
            ',"user":"Pepe","userFriendWith":"Steve","isMutual":1}'
        );
    }),
      it('Do not pass any info to POST return 400 with "Info required" text', () => {
        return request(app)
          .post("/connections")
          .send(undefined)
          .expect(400)
          .expect("Content-Type", /json/)
          .expect({ err: "Info required" });
      }),
      it("Can not connect a user with himself", () => {
        return request(app)
          .post("/connections")
          .send({ user: "Bob", userFriendWith: "Bob", isMutual: 2 })
          .expect(400)
          .expect("Content-Type", /json/)
          .expect({ err: "You cannot connect a user to himself" });
      }),
      it("isMutual is not equal to 0 or 1 throw an error", () => {
        return request(app)
          .post("/connections")
          .send({ user: "Bob", userFriendWith: "Steve", isMutual: 2 })
          .expect(400)
          .expect("Content-Type", /json/)
          .expect({
            err: "To mark a connection as mutual use '1' or '0' in the opposite case",
          });
      }),
      it("If user does not exit get an error message", () => {
        return request(app)
          .post("/connections")
          .send({ user: "Kaladin", userFriendWith: "Steve", isMutual: 0 })
          .expect(400)
          .expect("Content-Type", /json/)
          .expect({ err: "User doesn't exist" });
      }),
      it("If user wich is friend with does not exit get an error message", () => {
        return request(app)
          .post("/connections")
          .send({ user: "Bob", userFriendWith: "Kaladin", isMutual: 0 })
          .expect(400)
          .expect("Content-Type", /json/)
          .expect({ err: "User which is friend with doesn't exist" });
      }),
      it("Do not re-add existing connections", () => {
        return request(app)
          .post("/connections")
          .send({ user: "Bob", userFriendWith: "Steve", isMutual: 0 })
          .expect(400)
          .expect("Content-Type", /json/)
          .expect({ err: "Connection already exist" });
      }),
      it("Update existing connection to make it mutual instead of add a new one", () => {
        return request(app)
          .post("/connections")
          .send({ user: "Steve", userFriendWith: "Bob", isMutual: 0 })
          .expect(200)
          .expect("Content-Type", /json/)
          .expect(
            '{"id":2,"user":"Bob","userFriendWith":"Steve","isMutual":1}'
          );
      });
  });
});
