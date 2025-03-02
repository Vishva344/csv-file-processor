const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const Processing = require("../models/processing.model");
const { v4: uuidv4 } = require("uuid");

const processImages = async (requestId, products) => {
  try {
    for (const product of products) {
      const inputUrls = product.inputImageUrls.split(","); // Ensure it's treated as a string
      let processedUrl = "";

      for (const url of inputUrls) {
        const response = await axios({ url, responseType: "arraybuffer" });
        const compressedBuffer = await sharp(response.data)
          .jpeg({ quality: 50 })
          .toBuffer();

        const filename = `${uuidv4()}.jpg`;
        const filePath = `processed/${filename}`;
        fs.writeFileSync(filePath, compressedBuffer);

        // Store only the last processed image URL
        processedUrl = filePath;
      }

      // Update the product's outputUrl
      await Processing.findOneAndUpdate(
        { requestId, "products._id": product._id },
        { $set: { "products.$.outputUrl": processedUrl } },
        { new: true }
      );
    }

    // Update overall status
    await Processing.findOneAndUpdate({ requestId }, { status: "completed" });

    // Trigger Webhook after completion
    require("./webhook.service").triggerWebhook(requestId);
  } catch (error) {
    console.error("Error processing images:", error);
    await Processing.findOneAndUpdate({ requestId }, { status: "failed" });
  }
};

module.exports = processImages;
