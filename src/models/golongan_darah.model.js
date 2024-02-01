const main_db = require("../config/main_db.config");
const schema = require("../schemas/golongan_darah.schema");

const Model = main_db.model("Golongan Darah", schema);

module.exports = Model;
