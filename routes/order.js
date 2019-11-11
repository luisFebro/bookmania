const express = require("express");
const router = express.Router();

const { mwRequireSignin, mwIsAuth, mwIsAdmin } = require("../controllers/auth");
const { mwUserById, mwAddOrderToUserHistory } = require("../controllers/user");
const { mwDecreaseQuantity } = require("../controllers/product");
const { mwOrderById, create, getListOrders, getStatusValues, updateOrderStatus } = require("../controllers/order");

// @ routes api/order/...
// @ desc Add a new order
router.post("/create/:userId", mwRequireSignin, mwIsAuth, mwAddOrderToUserHistory, mwDecreaseQuantity, create);
router.get("/list/all/:userId", mwRequireSignin, mwIsAuth, mwIsAdmin, getListOrders)
// @ desc get the value of enum for order status ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"]
router.get("/status-values/:userId", mwRequireSignin, mwIsAuth, mwIsAdmin, getStatusValues)
router.put("/:orderId/status/:userId", mwRequireSignin, mwIsAuth, mwIsAdmin, updateOrderStatus)


router.param("userId", mwUserById);
router.param("orderId", mwOrderById);

module.exports = router;
