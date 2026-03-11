const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, elem) => acc + elem.likes, 0);
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likes = blogs.map((elem) => elem.likes);
  const maxIndex = likes.indexOf(Math.max(...likes));

  return blogs[maxIndex];
};

const getAuthorsBlogCount = (blogs) => {
  const authorsMap = new Map();
  blogs.forEach((elem) => {
    if (!authorsMap.has(elem.author)) {
      authorsMap.set(elem.author, 1);
    } else {
      authorsMap.set(elem.author, authorsMap.get(elem.author) + 1);
    }
  });

  const authorsArray = [];
  authorsMap.forEach((val, key) => {
    authorsArray.push({
      author: key,
      blogs: val,
    });
  });

  return authorsArray;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authors = getAuthorsBlogCount(blogs);
  const blogsCount = authors.map((elem) => elem.blogs);
  const maxIndex = blogsCount.indexOf(Math.max(...blogsCount));

  return authors[maxIndex];
};

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs };
