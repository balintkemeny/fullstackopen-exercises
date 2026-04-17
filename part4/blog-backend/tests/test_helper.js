const Blog = require("../models/blog");
const User = require("../models/user");

const multipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const nonExistentId = async () => {
  const blog = new Blog({
    title: "temp",
    author: "temp",
    url: "www.temp.com",
  });

  await blog.save();
  await blog.deleteOne();

  return blog.toJSON().id;
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const multipleUsers = [
  {
    _id: "69e0b0261d01f5a2fbf92cf1",
    username: "jdoe",
    name: "John Doe",
    passwordHash:
      "$2b$10$CrcUF6myfbgc8xQV05Twauqty0EDbQyv5W09iYS4ypTluNyPbEWJa",
    blogs: [],
    __v: 0,
  },
  {
    _id: "69e0cc8c2f0381ded3386201",
    username: "jndoe",
    name: "Jane Doe",
    passwordHash:
      "$2b$10$dtvefj59cmx3bn8KdvNzruXCbw2HCNKZmyjL87sVvU8HasoexBDgu",
    blogs: [],
    __v: 0,
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  multipleBlogs,
  nonExistentId,
  blogsInDb,
  multipleUsers,
  usersInDb,
};
