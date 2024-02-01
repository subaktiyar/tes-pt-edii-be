const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  posisi: { type: String, required: true },
  is_active: { type: Boolean, default: true },
});

module.exports = Schema;
