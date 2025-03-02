const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique ID for each product
  serialNumber: { type: String, required: true },
  productName: { type: String, required: true },
  inputImageUrls: { type: String, required: true },
  outputUrl: { type: String, default: "" }, // Store processed output URL
});

const processingSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  products: [productSchema], // Array of product objects
});

module.exports = mongoose.model("Processing", processingSchema);
