const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  studentId: { type: String, unique: true, required: true },
  contact: String,
});

module.exports = mongoose.model("User", userSchema);
