const express = require('express');
const { protect } = require("../middleware/authMiddleware.js");
const { getDashboardData, getDashboardSummary } = require("../controllers/dashboardController.js")

const router = express.Router();

// Full dashboard data
router.get("/", protect, getDashboardData);

// Lightweight dashboard summary
router.get("/summary", protect, getDashboardSummary);

module.exports = router;
