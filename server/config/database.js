const mongoose = require("mongoose");
//require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_DB);
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error", err);
    process.exit(1);
  }
};

module.exports = connectDB;

// const URL_DB = process.env.URL_DB;
// mongoose
//   .connect(URL_DB)
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log(err));

// const FileSchema = new mongoose.Schema({
//   filename: String,
//   path: String,
//   code: {
//     type: String,
//     unique: true,
//   },
//   createAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const FileModel = mongoose.model("File", FileSchema);
