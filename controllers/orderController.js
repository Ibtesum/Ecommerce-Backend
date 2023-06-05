import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import { v4 as uuidv4 } from 'uuid';
import Order from "../models/orderModel.js";
import Product from '../models/productModel.js';

dotenv.config()
const stripe = Stripe(`${process.env.STRIPE_SECRET_KEY}`)


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid with stripe
// @route   Ipdate /api/orders/:id/stripe
// @access  Private

const updateOrderToPaidStripe = asyncHandler(async (req, res) => { 
  const order = await Order.findById(req.params.id)
  const { stripeToken, totalPrice } = req.body
  const customer = await stripe.customers.create({
    email: stripeToken.email,
    source: stripeToken.id,
  })

  const payment = await stripe.charges.create(
    {
      amount: totalPrice * 100,
      currency: 'USD',
      customer: customer.id,
      receipt_email: stripeToken.email,
    },
    {
      idempotencyKey: uuidv4(),
    }
  )

  if (payment) {
    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.qty)
    })
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: payment.source.id,
      street: stripeToken.card.address_line1,
      city: stripeToken.card.address_city,
      country: stripeToken.card.address_country,
      pincode: stripeToken.card.address_zip,
      paid: payment.paid,
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})


async function updateStock(id, quantity) {
  //update stock bulk update
  await Product.updateOne(
    { _id: id },
    { $inc: { countInStock: -quantity } },
    {
      new: true,
      runValidators: true,
    }
  ).exec()
}

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaidStripe,
};

