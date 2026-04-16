const logger = require("./logger");

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === "MongoServerError" && error.code === 11000) {
    return response
      .status(400)
      .json({ error: "the field `username` must be unique" });
  }

  next(error);
};

module.exports = {
  errorHandler,
};
