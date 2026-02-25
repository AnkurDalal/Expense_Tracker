require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDb = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const incomeRoutes = require('./routes/incomeRoutes.js')
const expenseRoutes = require('./routes/expenseRoutes.js')
const dashboardRoutes = require('./routes/dashboardRoutes.js')
const app = express();

// Connect Database
connectDb();

// Middleware - CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware - JSON parser
app.use(express.json());

// Serve Upload Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
// Server Start
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});