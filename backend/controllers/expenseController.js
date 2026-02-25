
const Expense = require("../models/Expense.js");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");


// ADD EXPENSE 
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();

        res.status(200).json({ newExpense });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};


// GET ALL EXPENSE
exports.getAllExpense = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const expenses = await Expense.find({ userId: req.user.id })
            .sort({ date: -1 });

        res.status(200).json(expenses);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};


// DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        if (expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await expense.deleteOne();

        res.json({ message: "Expense deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};


// DOWNLOAD EXPENSE EXCEL 
exports.downloadExpenseExcel = async (req, res) => {
    try {
        const userId = req.user.id;

        const expenses = await Expense.find({ userId })
            .sort({ date: -1 });

        const data = expenses.map(item => ({
            Category: item.category,
            Amount: item.amount,
            Date: new Date(item.date).toLocaleDateString()
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expenses");

        // Create uploads folder if not exists
        const folderPath = path.join(__dirname, "../uploads");
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        const filePath = path.join(folderPath, "Expense_details.xlsx");

        // Write file to server folder
        xlsx.writeFile(wb, filePath);

        // Download file
        res.download(filePath);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};