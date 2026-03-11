const express = require('express');
const { protect } = require("../middleware/authMiddleware.js");
const { validateIncome, validateDateRange, handleValidationErrors } = require("../middleware/validationMiddleware.js");

const {
    addIncome,
    getAllIncome,
    getIncomeById,
    updateIncome,
    deleteIncome,
    getIncomeSummary,
    downloadIncomeExcel
} = require("../controllers/incomeController.js")

const router = express.Router();

// CRUD operations
router.post("/add", protect, validateIncome, handleValidationErrors, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/get/:id", protect, getIncomeById);
router.put("/update/:id", protect, validateIncome, handleValidationErrors, updateIncome);
router.delete("/delete/:id", protect, deleteIncome);

// Summary and analytics
router.get("/summary", protect, getIncomeSummary);

// Export operations
router.get("/downloadexcel", protect, downloadIncomeExcel);

module.exports = router;
