const allowedMineTypes = [
  "image/jpeg",
  "image/png",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/zip",
  "text/plain",
];

const validateFileType = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Файл не був завантежений" });
  }

  if (!allowedMineTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: "Недозволений тип файлу",
      allowedMineTypes: allowedMineTypes,
    });
  }
  next();
};

const validateFileSize = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024;

  if (req.file && req.file.size > maxSize) {
    return res.status(400).json({
      message: "Файл повинен бути меншим за 10MB",
      maxSize: "10MB",
    });
  }

  next();
};

module.exports = { validateFileType, validateFileSize };
