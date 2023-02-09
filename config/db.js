import mongoose from "mongoose";

mongoose.set('strictQuery', true);
const connetDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold.underline);
    process.exit(1);
  }
};

export default connetDB;
