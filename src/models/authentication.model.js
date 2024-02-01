const main_db = require("../config/main_db.config");
const schema = require("../schemas/authentication.schema");

const Model = main_db.model("Authentication", schema);

module.exports = Model;
