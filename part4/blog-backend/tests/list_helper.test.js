const { describe, test } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

describe("dummy", () => {
  test("returns one", () => {
    const blogs = [];

    assert.strictEqual(listHelper.dummy(blogs), 1);
  });
});
