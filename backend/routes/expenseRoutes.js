const express = require('express');
const { protect } = require("../middleware/authMiddleware.js");
const { validateExpense, validateDateRange, handleValidationErrors } = require("../middleware/validationMiddleware.js");

const {
    addExpense,
    getAllExpense,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getExpenseSummary,
    downloadExpenseExcel
} = require("../controllers/expenseController.js")

const router = express.Router();

// CRUD operations
router.post("/add", protect, validateExpense, handleValidationErrors, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/get/:id", protect, getExpenseById);
router.put("/update/:id", protect, validateExpense, handleValidationErrors, updateExpense);
router.delete("/delete/:id", protect, deleteExpense);

// Summary and analytics
router.get("/summary", protect, getExpenseSummary);

// Export operations
router.get("/downloadexcel", protect, downloadExpenseExcel);

module.exports = router;
