import SSLCommerzPayment from "sslcommerz-lts"
import Order from "../models/orderModel.js";
import ErrorResponse from "../utils/errorResponse.js";

const sslcommerz = new SSLCommerzPayment(
  process.env.STORE_ID,
  process.env.STORE_PASSWORD,
  false
); //true for live default false for sandbox

// @desc      initialize payment
// @route     POST /api/pay
// @access    Private
export const paymentInit = async (req, res, next) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (order) {
    const transactionId = "12xyz2580";
    const data = {
      total_amount: order.totalPrice,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${process.env.ROOT_URL}/api/pay/success?transactionId=${transactionId}&orderId=${orderId}`,
      fail_url: `${process.env.ROOT_URL}/api/pay/fail`,
      cancel_url: `${process.env.ROOT_URL}/api/pay/cancel`,
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
      multi_card_name: "internetbank",
      ipn_url: `${process.env.ROOT_URL}/api/pay/ipn`,
    };
    sslcommerz.init(data).then((data) => {
      //process the response that got from sslcommerz
      //https://developer.sslcommerz.com/doc/v4/#returned-parameters

      if (data?.GatewayPageURL) {
        return res.status(200).json(data.GatewayPageURL);
      } else {
        return res.status(400).json({
          message: "Something went wrong!",
        });
      }
    });
  } else {
    return next(new ErrorResponse("Order not found!", 404));
  }
};

export const paymentSuccess = async (req, res) => {
  const { transactionId, orderId } = req.query;
  //   set the order payment status true
  const order = await Order.findByIdAndUpdate(orderId, {
    isPaid: true,
    paidAt: Date.now(),
  });
  if (order) {
    res.redirect(`${process.env.CLIENT_URL}/orders/${orderId}`);
  }
};
