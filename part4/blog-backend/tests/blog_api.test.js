const { describe, test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.multipleBlogs);
});

describe("GET /api/blogs", () => {
  test("returns blogs in JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("returns the correct amount of blogs", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.multipleBlogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
