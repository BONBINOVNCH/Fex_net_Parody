const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const { nanoid } = require("nanoid");

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

const FileModel = mongoose.model("File", FileSchema);

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

//endpoints

app.post("/uploads", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Файл не знайдено" });
        }

        const fileCode = nanoid(6);

        const newFile = new FileModel({
            filrname: req.file.filename,
            path: req.file.path,
            code: fileCode,
        });

        await newFile.save();

        res.status(200).json({
            code: fileCode,
            message: "Файл успішно завантажено",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
