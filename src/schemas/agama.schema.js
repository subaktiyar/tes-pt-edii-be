const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  agama: { type: String, required: true },
  is_active: { type: Boolean, default: true },
});

module.exports = Schema;
