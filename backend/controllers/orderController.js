import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    // const frontend_url = "https://foodizo-on.netlify.app";
    const frontend_url = "http://localhost:5173";

    const { userId, items, address, deliveryFee, paymentMethod } = req.body;
    const itemsSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalDeliveryFee = typeof deliveryFee === "number" ? deliveryFee : 50;
    const orderTotal = itemsSubtotal + finalDeliveryFee;

    const newOrder = new orderModel({
      userId,
      items,
      amount: orderTotal,
      address,
      status: "Processing",
      payment: paymentMethod === "UPI" ? true : false, // UPI marked as paid instantly for our dummy integration
      paymentMethod: paymentMethod || "Stripe"
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Handle standard payment methods (COD, UPI) which bypass Stripe
    if (paymentMethod === "COD" || paymentMethod === "UPI") {
      return res.json({ success: true, message: "Order placed successfully" });
    }

    // Default to Stripe logic
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    if (finalDeliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Delivery Charges" },
          unit_amount: finalDeliveryFee * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.json({ success: false, message: "Error creating order" });
  }
}

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" })
    }
    else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" })
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

// user order for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

// list orders for admin

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

// api for update order status
const updateStaus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })

  }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStaus }
