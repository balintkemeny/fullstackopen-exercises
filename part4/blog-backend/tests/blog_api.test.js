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

describe("POST /api/blogs", () => {
  const newBlogTitle = "Lorem Ipsum";
  const newBlogPayload = {
    title: newBlogTitle,
    author: "John Doe",
    url: "www.example.com",
    likes: 0,
  };

  test("returns the new blog in the response", async () => {
    const response = await api.post("/api/blogs").send(newBlogPayload);
    const blogFromDb = await Blog.findOne({ title: newBlogTitle });

    assert.deepStrictEqual(response.body, blogFromDb.toJSON());
  });

  test("persists the new blog in the database", async () => {
    await api.post("/api/blogs").send(newBlogPayload);

    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.multipleBlogs.length + 1);
  });

  test("returns with status 201 and application/json as Content-Type", async () => {
    await api
      .post("/api/blogs")
      .send(newBlogPayload)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });
});

after(async () => {
  await mongoose.connection.close();
});
