import mongoose from "mongoose";

export default async function connectDB() {
  // Reuse existing connection across serverless invocations
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 8000
  });
  console.log("MongoDB connected");
}
