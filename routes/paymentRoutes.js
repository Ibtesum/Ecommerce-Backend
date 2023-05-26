import express from "express";
import SSLCommerzPayment from "sslcommerz-lts";
import { paymentInit, paymentSuccess } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  /**
   * Root url response
   */

  return res.status(200).json({
    message: "Welcome to sslcommerz app",
    url: `${process.env.ROOT_URL}/api/pay/ssl-request`,
  });
});

router.post("/", paymentInit);
router.post("/success", paymentSuccess);
router.get("/ssl-request", async (req, res) => {
  /**
   * Create ssl session request
   */

  const data = {
    total_amount: 100,
    currency: "BDT",
    tran_id: "REF123",
    success_url: `${process.env.ROOT_URL}/api/v1/pay/ssl-payment-success`,
    fail_url: `${process.env.ROOT_URL}/api/v1/pay/ssl-payment-fail`,
    cancel_url: `${process.env.ROOT_URL}/api/v1/pay/ssl-payment-cancel`,
    shipping_method: "No",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "cust@yahoo.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    multi_card_name: "mastercard",
    value_a: "ref001_A",
    value_b: "ref002_B",
    value_c: "ref003_C",
    value_d: "ref004_D",
    ipn_url: `${process.env.ROOT_URL}/ssl-payment-notification`,
  };

  const sslcommerz = new SSLCommerzPayment(
    process.env.STORE_ID,
    process.env.STORE_PASSWORD,
    false
  ); //true for live default false for sandbox
  sslcommerz.init(data).then((data) => {
    //process the response that got from sslcommerz
    //https://developer.sslcommerz.com/doc/v4/#returned-parameters

    if (data?.GatewayPageURL) {
      return res.status(200).redirect(data?.GatewayPageURL);
    } else {
      return res.status(400).json({
        message: "Session was not successful",
      });
    }
  });
});

router.post("/ssl-payment-notification", async (req, res) => {
  /**
   * If payment notification
   */

  return res.status(200).json({
    data: req.body,
    message: "Payment notification",
  });
});

router.post("/ssl-payment-success", async (req, res) => {
  /**
   * If payment successful
   */

  return res.status(200).json({
    data: req.body,
    message: "Payment success",
  });
});

router.post("/ssl-payment-fail", async (req, res) => {
  /**
   * If payment failed
   */

  return res.status(200).json({
    data: req.body,
    message: "Payment failed",
  });
});

router.post("/ssl-payment-cancel", async (req, res) => {
  /**
   * If payment cancelled
   */

  return res.status(200).json({
    data: req.body,
    message: "Payment cancelled",
  });
});

export default router;
