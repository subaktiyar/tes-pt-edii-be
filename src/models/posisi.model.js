const main_db = require("../config/main_db.config");
const schema = require("../schemas/posisi.schema");

const Model = main_db.model("Posisi", schema);

module.exports = Model;
