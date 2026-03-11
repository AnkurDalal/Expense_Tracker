const Income = require('../models/Income.js');
const Expense = require('../models/Expense.js');
const { Types } = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(userId);

        // Get date ranges for calculations
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const last60Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Total income and expense
        const [totalIncome, totalExpense] = await Promise.all([
            Income.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Expense.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        // Last 60 days income
        const last60DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: last60Days }
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions
            .reduce((sum, txn) => sum + txn.amount, 0);

        // Last 30 days expense
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: last30Days }
        }).sort({ date: -1 });

        const expensesLast30Days = last30DaysExpenseTransactions
            .reduce((sum, txn) => sum + txn.amount, 0);

        // Last 5 combined transactions
        const [recentIncome, recentExpense] = await Promise.all([
            Income.find({ userId: userObjectId })
                .sort({ date: -1 })
                .limit(5),
            Expense.find({ userId: userObjectId })
                .sort({ date: -1 })
                .limit(5)
        ]);

        const lastTransactions = [
            ...recentIncome.map(txn => ({
                ...txn.toObject(),
                type: "income"
            })),
            ...recentExpense.map(txn => ({
                ...txn.toObject(),
                type: "expense"
            }))
        ]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        // Monthly trend data for the last 6 months
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const monthlyData = await Income.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    totalIncome: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthlyExpenseData = await Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    totalExpense: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Category breakdown for expenses
        const expenseByCategory = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 5 }
        ]);

        // Source breakdown for income
        const incomeBySource = await Income.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: "$source",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
                    totalIncome: totalIncome[0]?.total || 0,
                    totalExpense: totalExpense[0]?.total || 0,
                    savingsRate: totalIncome[0]?.total > 0 
                        ? ((totalIncome[0]?.total - totalExpense[0]?.total) / totalIncome[0]?.total * 100).toFixed(2)
                        : 0
                },
                recentActivity: {
                    last30DaysExpenses: {
                        total: expensesLast30Days,
                        transactions: last30DaysExpenseTransactions
                    },
                    last60DaysIncome: {
                        total: incomeLast60Days,
                        transactions: last60DaysIncomeTransactions
                    },
                    recentTransactions: lastTransactions
                },
                analytics: {
                    monthlyTrends: {
                        income: monthlyData,
                        expense: monthlyExpenseData
                    },
                    topCategories: expenseByCategory,
                    topIncomeSources: incomeBySource
                }
            }
        });

    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching dashboard data" 
        });
    }
};

// Get dashboard summary only (lightweight version)
exports.getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(userId);

        const [totalIncome, totalExpense] = await Promise.all([
            Income.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Expense.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
                totalIncome: totalIncome[0]?.total || 0,
                totalExpense: totalExpense[0]?.total || 0,
                savingsRate: totalIncome[0]?.total > 0 
                    ? ((totalIncome[0]?.total - totalExpense[0]?.total) / totalIncome[0]?.total * 100).toFixed(2)
                    : 0
            }
        });

    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching dashboard summary" 
        });
    }
};
