const mongoose = require("mongoose");
require("dotenv").config();

async function initializeDatabase() {
  await mongoose
    .connect(process.env.MONGODB)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}
module.exports = { initializeDatabase };
