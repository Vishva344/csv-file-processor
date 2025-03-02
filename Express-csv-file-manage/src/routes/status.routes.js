const express = require("express");
const { checkStatus } = require("../controllers/status.controller");

const router = express.Router();
router.get("/status/:requestId", checkStatus);

module.exports = router;
