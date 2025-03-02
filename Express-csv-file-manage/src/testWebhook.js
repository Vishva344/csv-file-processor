const { triggerWebhook } = require("testWebhook.js"); // Adjust the path accordingly

const requestId = "your_request_id_here"; // Replace with an actual requestId
const processedImages = [
  { _id: "image1_id", outputUrl: "https://example.com/output1.jpg" },
  { _id: "image2_id", outputUrl: "https://example.com/output2.jpg" },
];

(async () => {
  await triggerWebhook(requestId, processedImages);
})();
