const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  menu: { type: Object, required: true },
  is_active: { type: Boolean, default: true },
});

module.exports = Schema;
