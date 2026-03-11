const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database Connected");
  } catch (error) {
    console.log("Database not connected!", error);
    process.exit(1);
  }
};

module.exports = connectDb;
