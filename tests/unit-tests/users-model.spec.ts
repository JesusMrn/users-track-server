import { assert } from "chai";

import { usersModel } from "../../src/models/users-model";

describe("Unit tests for getting stats", () => {
  it("The collected stats are correct", async () => {
    const aux = await usersModel.listUsers();
    const stats = await usersModel.getStats(aux);

    stats.forEach(async (stat) => {
        const userFriends = await usersModel.getUsersFriends(stat.name);
        assert.equal(stat.friends, userFriends.length)
    })
  });
});
