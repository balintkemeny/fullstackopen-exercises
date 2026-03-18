const { describe, before, beforeEach, test, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const config = require("../utils/config");
const Blog = require("../models/blog");

before(async () => {
  await mongoose.connect(config.MONGO_CONN_STRING, { family: 4 });
});

describe("Blog Model", () => {
  const blogTitle = "Lorem Ipsum";

  beforeEach(async () => {
    await Blog.deleteMany({});
    const blog = new Blog({
      title: blogTitle,
      author: "John Doe",
      url: "www.example.com",
      likes: 0,
    });

    await blog.save();
  });

  test("the database generates a unique identifier and stores it in the _id field", async () => {
    const returnedBlogs = await Blog.find({ title: blogTitle });

    assert(returnedBlogs[0]._id);
  });

  describe("toJSON", () => {
    test("returns the id in the id field, and removes the _id field", async () => {
      const returnedBlogs = await Blog.find({ title: blogTitle });
      const blogJson = returnedBlogs[0].toJSON();

      assert(blogJson.id);
      assert(!blogJson._id);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
