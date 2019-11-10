const express = require("express");
const router = express.Router();

const { requireSignin, mwIsAuth } = require("../controllers/auth");
const { mwUserById } = require("../controllers/user");
const { create } = require("../controllers/order");

// @ route POST api/order/create/:userId
// @ desc Add a new order
router.post("/create/:userId", requireSignin, mwIsAuth, create);

router.param("userId", mwUserById);

module.exports = router;
