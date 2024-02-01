const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "member" },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, required: true },
  created_by: { type: String, required: true },
  updated_at: { type: Date, required: true },
  updated_by: { type: String, required: true },
  deleted_at: { type: Date },
  deleted_by: { type: String },
});

module.exports = Schema;
