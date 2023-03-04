import AsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = AsyncHandler(async (req, res) => {
  const products = await Product.find({});

  res.json(products);
});

// @desc Fetch single product by id
// @route GET /api/products/:id
// @access Public

const getProductById = AsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  // Wrote this to solve CastError. Didn't work
  // if (!isValidObjectId(req.params.id)) {
  //   res.status(400);
  //   throw new Error("Invalid user id");
  // }
  // if (product) {
  //   res.json(product);
  // }

  if (product) {
    res.json(product);
  } else {
    console.log("eh he");
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getProducts, getProductById };
