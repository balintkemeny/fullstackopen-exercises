const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, elem) => acc + elem.likes, 0);
};

module.exports = { dummy, totalLikes };
