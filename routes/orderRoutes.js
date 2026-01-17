const express = require("express");
const router = express.Router();

// import controller
const { placeOrder, getUserOrders, getOrderById } = require("../controllers/orderController");

// ✅ PLACE ORDER ROUTE
router.post("/", placeOrder);
router.get("/user/:userId", getUserOrders);
router.get("/:orderId", getOrderById);


module.exports = router;
