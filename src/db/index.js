const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const connectDB = async () => {
  try {
    // Connect to MongoDB Atlas using the URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
