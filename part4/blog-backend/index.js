const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const app = require("./app");

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

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
