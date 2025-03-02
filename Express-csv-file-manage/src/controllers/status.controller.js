const Processing = require("../models/processing.model");

const checkStatus = async (req, res) => {
  const { requestId } = req.params;
  const record = await Processing.findOne({ requestId });
  if (!record) return res.status(404).json({ message: "Request ID not found" });
  res.json({ status: record.status, outputUrls: record.outputUrls || [] });
};

module.exports = { checkStatus };
