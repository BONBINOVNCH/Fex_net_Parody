const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const { uploadFile, downloadFile } = require("../controllers/fileController");
const {
  validateFileType,
  validateFileSize,
} = require("../middleware/fileValidation");

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
router.post(
  "/upload",
  upload.single("file"),
  validateFileType,
  validateFileSize,
  uploadFile
);

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
router.get("/download/:code", downloadFile);

module.exports = router;
