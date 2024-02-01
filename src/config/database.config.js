require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV;
const MONGO_PORT = process.env.MONGO_PORT;

const MONGO_CLOUD_TEST = process.env.MONGO_CLOUD_TEST;
const MONGO_HOST_TEST = process.env.MONGO_HOST_TEST;
const MONGO_DB_TEST = process.env.MONGO_DB_TEST;
const MONGO_USERNAME_TEST = process.env.MONGO_USERNAME_TEST;
const MONGO_PASSWORD_TEST = process.env.MONGO_PASSWORD_TEST;

function MongoDBConfig({
  MONGO_CLOUD,
  MONGO_HOST,
  MONGO_DB,
  MONGO_USERNAME,
  MONGO_PASSWORD,
}) {
  let dbConnection = null;
  let dbOptions = null;

  if (["test", "development"].includes(NODE_ENV.toLowerCase())) {
    dbConnection =
      MONGO_CLOUD_TEST ||
      `mongodb://${MONGO_HOST_TEST}:${MONGO_PORT}/${MONGO_DB_TEST}`;

    dbOptions = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      authSource: "admin",
      user: MONGO_USERNAME_TEST,
      pass: MONGO_PASSWORD_TEST,
    };
  } else {
    dbConnection =
      MONGO_CLOUD || `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

    dbOptions = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      authSource: "admin",
      user: MONGO_USERNAME,
      pass: MONGO_PASSWORD,
    };
  }

  return { dbConnection, dbOptions };
}

function MySQLConfig() {}

function PostgresSQLConfig() {}

module.exports = { MongoDBConfig };
