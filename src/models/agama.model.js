const main_db = require("../config/main_db.config");
const schema = require("../schemas/agama.schema");

const Model = main_db.model("Agama", schema);

module.exports = Model;
