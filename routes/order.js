const express = require("express");
const router = express.Router();

const { mwRequireSignin, mwIsAuth, mwIsAdmin } = require("../controllers/auth");
const { mwUserById, mwAddOrderToUserHistory } = require("../controllers/user");
const { mwDecreaseQuantity } = require("../controllers/product");
const { create, getListOrders, getStatusValues } = require("../controllers/order");

// @ route POST api/order/create/:userId
// @ desc Add a new order
router.post("/create/:userId", mwRequireSignin, mwIsAuth, mwAddOrderToUserHistory, mwDecreaseQuantity, create);

// @ route GET api/order/list/all/:userId
router.get("/list/all/:userId", mwRequireSignin, mwIsAuth, mwIsAdmin, getListOrders)
// @ route GET api/order/list/all/:userId
router.get("/status-values/:userId", mwRequireSignin, mwIsAuth, mwIsAdmin, getStatusValues)


router.param("userId", mwUserById);

module.exports = router;
