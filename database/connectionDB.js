import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to DB:", err.message);
    }
}

export default connectDB;