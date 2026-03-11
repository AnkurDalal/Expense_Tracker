const Expense = require("../models/Expense.js");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

// Add expense
exports.addExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const { icon, category, amount, date } = req.body;

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();

        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            data: newExpense
        });

    } catch (error) {
        console.error('Add expense error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error adding expense" 
        });
    }
};

// Get all expenses with pagination and filtering
exports.getAllExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Date filtering
        const { startDate, endDate } = req.query;
        const dateFilter = {};
        
        if (startDate && endDate) {
            dateFilter.$gte = new Date(startDate);
            dateFilter.$lte = new Date(endDate);
        } else if (startDate) {
            dateFilter.$gte = new Date(startDate);
        } else if (endDate) {
            dateFilter.$lte = new Date(endDate);
        }

        const query = { userId };
        if (Object.keys(dateFilter).length > 0) {
            query.date = dateFilter;
        }

        const [expenses, totalCount] = await Promise.all([
            Expense.find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit),
            Expense.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: {
                expenses,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit,
                    hasNextPage: page < Math.ceil(totalCount / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get all expenses error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching expenses" 
        });
    }
};

// Get expense by ID
exports.getExpenseById = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;

        const expense = await Expense.findOne({ _id: expenseId, userId });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.status(200).json({
            success: true,
            data: expense
        });

    } catch (error) {
        console.error('Get expense by ID error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching expense" 
        });
    }
};

// Update expense
exports.updateExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;
        const { icon, category, amount, date } = req.body;

        const expense = await Expense.findOne({ _id: expenseId, userId });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        // Update fields
        if (icon !== undefined) expense.icon = icon;
        if (category !== undefined) expense.category = category;
        if (amount !== undefined) expense.amount = amount;
        if (date !== undefined) expense.date = new Date(date);

        await expense.save();

        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: expense
        });

    } catch (error) {
        console.error('Update expense error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error updating expense" 
        });
    }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;

        const expense = await Expense.findOne({ _id: expenseId, userId });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        await expense.deleteOne();

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error deleting expense" 
        });
    }
};

// Get expense summary
exports.getExpenseSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.$gte = new Date(startDate);
            dateFilter.$lte = new Date(endDate);
        }

        const query = { userId };
        if (Object.keys(dateFilter).length > 0) {
            query.date = dateFilter;
        }

        const summary = await Expense.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: "$amount" },
                    averageExpense: { $avg: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const byCategory = await Expense.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: summary[0] || { totalExpense: 0, averageExpense: 0, count: 0 },
                byCategory
            }
        });

    } catch (error) {
        console.error('Get expense summary error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching expense summary" 
        });
    }
};

// Download expense Excel
exports.downloadExpenseExcel = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.$gte = new Date(startDate);
            dateFilter.$lte = new Date(endDate);
        }

        const query = { userId };
        if (Object.keys(dateFilter).length > 0) {
            query.date = dateFilter;
        }

        const expenses = await Expense.find(query).sort({ date: -1 });

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
        res.download(filePath, 'Expense_details.xlsx', (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ 
                    success: false,
                    message: "Error downloading file" 
                });
            }
        });

    } catch (error) {
        console.error('Download expense Excel error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error downloading expense data" 
        });
    }
};
