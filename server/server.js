const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");

require("dotenv").config();

// config express
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(express.static("public"));

//config db

const URL_DB = process.env.URL_DB;
mongoose
  .connect(URL_DB)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

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

const FileModel = mongoose.model("File", FileSchema);

// config storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// endpoints
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 *    /upload:
 *        post:
 *            summary: Завантаження файлу
 *            tags: [Files]
 *            requestBody:
 *                required: true
 *                content:
 *                    multipart/form-data:
 *                        schema:
 *                            type: object
 *                            properties:
 *                                file:
 *                                    type: string
 *                                    format: binary
 *            responses:
 *                201:
 *                    description: Файл успішно завантажено
 *                400:
 *                    description: Файл не був завантажении
 */
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не був завантежении" });
    }

    const fileCode = nanoid(6);

    const newFile = new FileModel({
      filename: req.file.filename,
      path: req.file.path,
      code: fileCode,
    });

    await newFile.save();

    res.status(201).json({
      code: fileCode,
      message: "Файл успішно завантажено",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 *    /download/{code}:
 *        get:
 *            summary: Завантаження файлу
 *            tags: [Files]
 *            parameters:
 *                - in: path
 *                  name: code
 *                  required: true
 *            responses:
 *                200:
 *                    description: Файл успішно завантажено
 *                404:
 *                    description: Файл не знайдено
 */
app.get("/download/:code", async (req, res) => {
  try {
    const fileData = await FileModel.findOne({ code: req.params.code });

    if (!fileData) {
      return res.status(404).json({ message: "Файл не знайдено" });
    }

    res.download(fileData.path, fileData.filename);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
