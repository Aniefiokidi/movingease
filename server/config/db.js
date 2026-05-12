import mongoose from "mongoose";

let cached = global._mongooseConnection;

export default async function connectDB() {
  if (cached && cached.readyState === 1) return;
  cached = await mongoose.connect(process.env.MONGODB_URI);
  global._mongooseConnection = mongoose.connection;
  console.log("MongoDB connected");
}
