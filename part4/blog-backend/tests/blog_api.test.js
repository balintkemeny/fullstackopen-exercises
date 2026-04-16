const { describe, test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

describe("/api/blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.multipleBlogs);
  });

  describe("GET /", () => {
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

  describe("POST /", () => {
    const newBlogTitle = "Lorem Ipsum";
    const newBlogPayload = {
      title: newBlogTitle,
      author: "John Doe",
      url: "www.example.com",
      likes: 42,
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

    test("given request payload without likes, likes will be 0 by default", async () => {
      const payloadWithoutLikes = {
        title: newBlogTitle,
        author: "John Doe",
        url: "www.example.com",
      };

      const response = await api.post("/api/blogs").send(payloadWithoutLikes);

      assert.strictEqual(response.body.likes, 0);
    });

    test("given request payload without title, it responds with status 400", async () => {
      const payloadWithoutTitle = {
        author: "John Doe",
        url: "www.example.com",
        likes: 42,
      };

      await api.post("/api/blogs").send(payloadWithoutTitle).expect(400);
    });

    test("given request payload without url, it responds with status 400", async () => {
      const payloadWithoutUrl = {
        title: newBlogTitle,
        author: "John Doe",
        likes: 42,
      };

      await api.post("/api/blogs").send(payloadWithoutUrl).expect(400);
    });
  });

  describe("DELETE /:id", () => {
    test("given a valid blog id it deletes it from the database and responds with 204", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const idToDelete = blogsAtStart[0].id;

      await api.delete(`/api/blogs/${idToDelete}`).expect(204);

      const blogsAfterDeletion = await helper.blogsInDb();
      const remainingIds = blogsAfterDeletion.map((blog) => blog.id);

      assert(!remainingIds.includes(idToDelete));
      assert.strictEqual(blogsAfterDeletion.length, blogsAtStart.length - 1);
    });

    test("given a non-existent id it responds with 204, does not delete further blogs", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const idToDelete = await helper.nonExistentId();

      await api.delete(`/api/blogs/${idToDelete}`).expect(204);

      const blogsAfterDeletion = await helper.blogsInDb();

      assert.strictEqual(blogsAfterDeletion.length, blogsAtStart.length);
    });
  });

  describe("PUT /:id", () => {
    test("given a valid id and valid request payload it updates the blog", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const payload = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 123,
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(payload)
        .expect(200);

      assert.deepStrictEqual(response.body, {
        ...payload,
        id: blogToUpdate.id,
      });
    });

    test("given a valid id and an incomplete payload it responds with 400", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const payload = {
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 123,
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(payload)
        .expect(400);

      assert.deepStrictEqual(response.body, {
        error: "Blog validation failed: title: Path `title` is required.",
      });
    });

    test("given a non-existent id it responds with 404", async () => {
      const id = await helper.nonExistentId();

      const payload = {
        title: "title",
        author: "author",
        url: "www.example.com",
        likes: 123,
      };

      await api.put(`/api/blogs/${id}`).send(payload).expect(404);
    });

    test("given a malformed id it responds with 400", async () => {
      const id = "abcdzzz1";

      const payload = {
        title: "title",
        author: "author",
        url: "www.example.com",
        likes: 123,
      };

      const response = await api
        .put(`/api/blogs/${id}`)
        .send(payload)
        .expect(400);

      assert.deepStrictEqual(response.body, {
        error: "malformed id",
      });
    });
  });
});

describe("/api/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.multipleUsers);
  });

  describe("GET /", () => {
    test("returns users in JSON format", async () => {
      await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("returns the correct amount of users", async () => {
      const response = await api.get("/api/users");

      assert.strictEqual(response.body.length, helper.multipleUsers.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
