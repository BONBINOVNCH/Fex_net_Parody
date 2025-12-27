const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const { create } = require("domain");
require("dotenv").config();

//config express

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

//config db

const URL_DB = process.env.URL_DB;
mongoose
    .connect(URL_DB)
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

const FileSchema = new mongoose.Schema({
    filrname: String,
    path: String,
    code: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const File = mongoose.model("File", FileSchema);

//config storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
