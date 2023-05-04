import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connetDB from "./config/db.js";
import products from "./data/products.js";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

dotenv.config();

connetDB();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
