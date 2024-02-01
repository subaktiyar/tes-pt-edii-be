const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  golongan_darah: { type: String, required: true },
  is_active: { type: Boolean, default: true },
});

module.exports = Schema;
