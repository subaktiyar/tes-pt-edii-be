const main_db = require("../config/main_db.config");
const schema = require("../schemas/user.schema");

const Model = main_db.model("User", schema);

module.exports = Model;
