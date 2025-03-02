const express = require("express");
const connectDB = require("./config/db.config");
const uploadRoutes = require("./routes/upload.routes");
const statusRoutes = require("./routes/status.routes");
const webhookRoutes = require("./routes/webhook");
require("dotenv").config();

const app = express();
app.use(express.json());

connectDB();

app.use("/api", uploadRoutes);
app.use("/api", statusRoutes);
app.use("/webhook", webhookRoutes);

module.exports = app;
