import mongoose from "mongoose";

async function connectDB() {
  try {
    console.log("Connecting to MongoDB...", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mydb")
     
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  
  }
}

export default connectDB;
