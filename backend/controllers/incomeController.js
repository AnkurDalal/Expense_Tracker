const Income = require("../models/Income.js")
const xlsx = require('xlsx')
const path = require("path");
const fs = require("fs");

// Add income source
exports.addIncome = async (req, res) => {
    try {
        const userId = req.user.id;
        const { icon, source, amount, date } = req.body;

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        })
        
        await newIncome.save()
        
        res.status(201).json({
            success: true,
            message: "Income added successfully",
            data: newIncome
        })
    } catch (error) {
        console.error('Add income error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error adding income" 
        })
    }
}

// Get all income sources with pagination and filtering
exports.getAllIncome = async (req, res) => {
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

        const [income, totalCount] = await Promise.all([
            Income.find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit),
            Income.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: {
                income,
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
        console.error('Get all income error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching income data" 
        });
    }
};

// Get income by ID
exports.getIncomeById = async (req, res) => {
    try {
        const userId = req.user.id;
        const incomeId = req.params.id;

        const income = await Income.findOne({ _id: incomeId, userId });

        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        res.status(200).json({
            success: true,
            data: income
        });

    } catch (error) {
        console.error('Get income by ID error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching income" 
        });
    }
};

// Update income source
exports.updateIncome = async (req, res) => {
    try {
        const userId = req.user.id;
        const incomeId = req.params.id;
        const { icon, source, amount, date } = req.body;

        const income = await Income.findOne({ _id: incomeId, userId });

        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        // Update fields
        if (icon !== undefined) income.icon = icon;
        if (source !== undefined) income.source = source;
        if (amount !== undefined) income.amount = amount;
        if (date !== undefined) income.date = new Date(date);

        await income.save();

        res.status(200).json({
            success: true,
            message: "Income updated successfully",
            data: income
        });

    } catch (error) {
        console.error('Update income error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error updating income" 
        });
    }
};

// Delete income source
exports.deleteIncome = async (req, res) => {
    try {
        const userId = req.user.id;
        const incomeId = req.params.id;

        const income = await Income.findOne({ _id: incomeId, userId });

        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        await income.deleteOne();
        
        res.status(200).json({
            success: true,
            message: "Income deleted successfully"
        });

    } catch (error) {
        console.error('Delete income error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error deleting income" 
        });
    }
};

// Get income summary
exports.getIncomeSummary = async (req, res) => {
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

        const summary = await Income.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$amount" },
                    averageIncome: { $avg: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const bySource = await Income.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$source",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: summary[0] || { totalIncome: 0, averageIncome: 0, count: 0 },
                bySource
            }
        });

    } catch (error) {
        console.error('Get income summary error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching income summary" 
        });
    }
};

// Download income Excel
exports.downloadIncomeExcel = async (req, res) => {
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

        const income = await Income.find(query).sort({ date: -1 });

        const data = income.map(item => ({
            Source: item.source,
            Amount: item.amount,
            Date: new Date(item.date).toLocaleDateString()
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");

        // Create folder if not exists
        const folderPath = path.join(__dirname, "../uploads");
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // File path
        const filePath = path.join(folderPath, "income_details.xlsx");

        // Write file
        xlsx.writeFile(wb, filePath);

        // Send file for download
        res.download(filePath, 'income_details.xlsx', (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ 
                    success: false,
                    message: "Error downloading file" 
                });
            }
        });

    } catch (error) {
        console.error('Download income Excel error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error downloading income data" 
        });
    }
};
