const FileModel = require("../models/File");
const { generateFileCode } = require("../utils/codeGenerator");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не був завантежений" });
    }

    const fileCode = generateFileCode();

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
};

const downloadFile = async (req, res) => {
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
};

module.exports = { uploadFile, downloadFile };
