import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/leetcode";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("CONNECTED TO MONGODB");
  } catch (err) {
    console.error("MONGODB CONNECTION ERROR:", err);
    process.exit(1); // exit if DB fails
  }
};
