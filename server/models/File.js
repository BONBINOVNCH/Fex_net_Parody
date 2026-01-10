const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  code: {
    type: String,
    unique: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", FileSchema);

//const FileModel = mongoose.model("File", FileSchema);
