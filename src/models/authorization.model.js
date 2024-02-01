const main_db = require("../config/main_db.config");
const schema = require("../schemas/authorization.schema");

const Model = main_db.model("Authorization", schema);

module.exports = Model;
