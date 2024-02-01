const main_db = require("../config/main_db.config");
const schema = require("../schemas/jenis_kelamin.schema");

const Model = main_db.model("Jenis Kelamin", schema);

module.exports = Model;
