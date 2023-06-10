import mongoose from "mongoose";
require("dotenv").config();

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (conn.connection.readyState === 1) console.log("MongoDB Connected");
    else console.log("MongoDB not connected");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
export default dbConnect;
