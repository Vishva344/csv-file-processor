const express = require("express");
const router = express.Router();
const Processing = require("../models/processing.model");
const { triggerWebhook } = require("../services/webhook.service"); // Import service

router.post("/", async (req, res) => {
  try {
    console.log("Webhook received:", req.body);

    const { requestId, processedImages } = req.body;

    if (
      !requestId ||
      !Array.isArray(processedImages) ||
      processedImages.length === 0
    ) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    // Find the processing document by requestId
    const processingRecord = await Processing.findOne({ requestId });

    if (!processingRecord) {
      return res.status(404).json({ message: "Request ID not found" });
    }

    // Loop through processedImages and update matching product outputUrls array
    for (const image of processedImages) {
      const { _id, outputUrl } = image;

      await Processing.updateOne(
        { requestId, "products._id": _id }, // Match product inside the array
        { $set: { "products.$.outputUrl": outputUrl } }, // Replace outputUrl
        { runValidators: false }
      );
    }

    console.log("Updated Record:", processingRecord);

    // ✅ Call triggerWebhook function
    await triggerWebhook(requestId, processedImages);

    return res.status(200).json({
      message: "Status and output URLs updated successfully",
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
