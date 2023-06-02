import { v2 as cloudinary } from 'cloudinary';
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from 'express-fileupload';
import connetDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

connetDB();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Api is running");
});


cloudinary.config({
  cloud_name: "doead3ngo",
  api_key: "418786713127971",
  api_secret: "hp45PMmnFkyJzMJQadOUieRvUA0"
});

//file upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
)

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/pay", paymentRoutes)
app.use("/api/upload", uploadRoutes)




app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port ${PORT}`
  )
);
