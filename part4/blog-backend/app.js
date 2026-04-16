const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

logger.info("Environment:", config.ENVIRONMENT);

const app = express();

logger.info(
  "connecting to MongoDB at:",
  config.MONGO_CONN_STRING.split("@")[1].split("/")[0],
);
mongoose
  .connect(config.MONGO_CONN_STRING, { family: 4 })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use(middleware.errorHandler);

module.exports = app;
