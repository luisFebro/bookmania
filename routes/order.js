const express = require("express");
const router = express.Router();

const { requireSignin, mwIsAuth } = require("../controllers/auth");
const { mwUserById, mwAddOrderToUserHistory } = require("../controllers/user");
const { mwDecreaseQuantity } = require("../controllers/product");
const { create } = require("../controllers/order");

// @ route POST api/order/create/:userId
// @ desc Add a new order
router.post("/create/:userId", requireSignin, mwIsAuth, mwAddOrderToUserHistory, mwDecreaseQuantity, create);

router.param("userId", mwUserById);

module.exports = router;
