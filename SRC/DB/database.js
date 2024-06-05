import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            // newUrlParser : true,
            // useUnifiedTopology : true......
        })
        console.log(`MongoDB connected successfully:${conn.connection.host}`)
    } catch (error) {
        console.error(`Error while connecting${error.message}`)
        process.exit(1)
    }
}

export default connectDB;