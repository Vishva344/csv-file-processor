const axios = require("axios");
const Processing = require("../models/processing.model");

const triggerWebhook = async (requestId, processedImages) => {
  const webhookURL = "https://780f-103-240-170-58.ngrok-free.app/webhook";
  console.log("🚀 ~ triggerWebhook ~ webhookURL:", webhookURL);

  try {
    // Check if document exists before updating
    const existingRecord = await Processing.findOne({ requestId });
    if (!existingRecord) {
      console.error(`No document found for requestId: ${requestId}`);
      return;
    }

    console.log("Existing record found:", existingRecord);

    // Update status to 'completed' in the database
    const updatedRecord = await Processing.findOneAndUpdate(
      { requestId },
      { status: "completed" }
    );

    if (!updatedRecord) {
      console.error("Failed to update status for requestId:", requestId);
      return;
    }

    console.log("Updated record:", updatedRecord);

    // Validate processedImages before sending
    if (!Array.isArray(processedImages) || processedImages.length === 0) {
      console.error("Processed images array is invalid or empty.");
      return;
    }

    // Send webhook request
    const response = await axios.post(webhookURL, {
      requestId,
      status: "completed",
      processedImages,
    });

    console.log("Webhook triggered successfully:", response.data);
  } catch (error) {
    console.error("Webhook failed:", error.message);

    // Rollback status to 'failed' if webhook fails
    // await Processing.updateOne({ requestId }, { $set: { status: "failed" } });
  }
};

module.exports = { triggerWebhook };
