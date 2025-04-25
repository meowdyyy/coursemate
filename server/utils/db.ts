import mongoose from 'mongoose';
require("dotenv").config();

const dbUrl: string = process.env.DB_URL || '';

const connectDB = async () => {
    try {
        const data = await mongoose.connect(dbUrl);
        console.log(`Database connected with ${data.connection.host}`);
    } catch (error: any) {
        console.log("MongoDB connection error:", error.message);
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
};

export default connectDB;

