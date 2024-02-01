const mongoose = require("mongoose");
const debug = require("debug")("backend:database:main");
const { MongoDBConfig } = require("./database.config");

const { dbConnection, dbOptions } = MongoDBConfig({
  MONGO_CLOUD: process.env.MONGO_CLOUD,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_DB: process.env.MONGO_DB,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
});

const connection = mongoose.createConnection(dbConnection, dbOptions);

connection.on("open", (ref) => {
  debug(`open connection to ${dbConnection}.`);
});

connection.on(`connected`, (ref) => {
  debug(`connected to ${dbConnection}.`);
});

connection.on(`disconnected`, (ref) => {
  debug(`disconnected from ${dbConnection}.`);
});

connection.on(`close`, (ref) => {
  debug(`close connection to ${dbConnection}`);
});

connection.on(`error`, (err) => {
  debug(`error connection to ${dbConnection}!`);
  debug(`caused by : ${err}`);
});

connection.on(`reconnect`, (ref) => {
  debug(`reconnect to ${dbConnection}.`);
});

module.exports = connection;
