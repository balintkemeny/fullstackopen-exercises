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

const getAuthorsLikeCount = (blogs) => {
  const authorLikesMap = new Map();
  for (let blog of blogs) {
    if (!authorLikesMap.has(blog.author)) {
      authorLikesMap.set(blog.author, 0);
    }

    authorLikesMap.set(
      blog.author,
      authorLikesMap.get(blog.author) + blog.likes,
    );
  }

  const authorsArray = [];
  authorLikesMap.forEach((val, key) => {
    authorsArray.push({
      author: key,
      likes: val,
    });
  });

  return authorsArray;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorsArray = getAuthorsLikeCount(blogs);
  const likesCount = authorsArray.map((elem) => elem.likes);
  const maxIndex = likesCount.indexOf(Math.max(...likesCount));

  return authorsArray[maxIndex];
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
