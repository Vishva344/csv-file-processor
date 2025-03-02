const multer = require("multer");
const path = require("path");
const Processing = require("../models/processing.model");
const parseCSV = require("../utils/csvParser");
const processImages = require("../services/imageProcessor.service");
const { v4: uuidv4 } = require("uuid");

const upload = multer({ dest: path.join(__dirname, "../../uploads/") });

const uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const requestId = uuidv4();
  const products = await parseCSV(req.file.path);

  await Processing.create({ requestId, status: "processing", products });

  processImages(requestId, products);

  res.json({ requestId });
};

module.exports = { upload, uploadCSV };
