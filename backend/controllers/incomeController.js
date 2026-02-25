const Income = require("../models/Income.js")
const xlsx = require('xlsx')
const path = require("path");
const fs = require("fs");

// add income source;
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        //validation checking for missing fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required !" })
        } const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        })
        await newIncome.save()
        res.status(200).json({ newIncome })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

//get all Income source
exports.getAllIncome = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const income = await Income.find({ userId: req.user.id })
            .sort({ date: -1 });

        res.status(200).json(income);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

//delete income source
exports.deleteIncome = async (req, res) => {

    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}
//download excel
exports.downloadIncomeExcel = async (req, res) => {
    try {
        const userId = req.user.id;

        const income = await Income.find({ userId }).sort({ date: -1 });

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
        res.download(filePath);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};