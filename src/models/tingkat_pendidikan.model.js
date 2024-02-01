const main_db = require("../config/main_db.config");
const schema = require("../schemas/tingkat_pendidikan.schema");

const Model = main_db.model("Tingkat Pendidikan", schema);

module.exports = Model;
