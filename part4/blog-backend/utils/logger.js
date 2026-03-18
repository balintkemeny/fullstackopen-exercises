const config = require("./config");

const info = (...params) => {
  if (config.ENVIRONMENT !== "test") {
    console.log(...params);
  }
};

const error = (...params) => {
  if (config.ENVIRONMENT !== "test") {
    console.error(...params);
  }
};

module.exports = { info, error };
