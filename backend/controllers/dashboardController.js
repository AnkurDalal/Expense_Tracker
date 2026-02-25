const Income = require('../models/Income.js');
const Expense = require('../models/Expense.js');
const { Types } = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(userId);

        //  TOTAL INCOME 
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        //  TOTAL EXPENSE 
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // LAST 60 DAYS INCOME 
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions
            .reduce((sum, txn) => sum + txn.amount, 0);

        //  LAST 30 DAYS EXPENSE 
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        const expensesLast30Days = last30DaysExpenseTransactions
            .reduce((sum, txn) => sum + txn.amount, 0);

        // LAST 5 COMBINED TRANSACTIONS 
        const recentIncome = await Income.find({ userId })
            .sort({ date: -1 })
            .limit(5);

        const recentExpense = await Expense.find({ userId })
            .sort({ date: -1 })
            .limit(5);

        const lastTransactions = [
            ...recentIncome.map(txn => ({
                ...txn.toObject(),
                type: "income"
            })),
            ...recentExpense.map(txn => ({
                ...txn.toObject(),
                type: "expense"
            }))
        ].sort((a, b) => b.date - a.date)
            .slice(0, 5);

        //FINAL RESPONSE 
        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) -
                (totalExpense[0]?.total || 0),

            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,

            last30DaysExpenses: {
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions
            },

            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions
            },

            recentTransactions: lastTransactions
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};