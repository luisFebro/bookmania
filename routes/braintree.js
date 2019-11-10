const express = require("express");
const router = express.Router();

const { mwRequireSignin, mwIsAuth } = require("../controllers/auth");
const { mwUserById } = require("../controllers/user");
const { generateToken, processPayment } = require("../controllers/braintree");

// @ route api/braintree/get-token/:userId
// @ desc GET generate token to be sent to front end (component Checkout when it mounts)
// @ return clientToken [string] / success [bool]
router.get("/get-token/:userId", mwRequireSignin, mwIsAuth, generateToken);

// @ route api/braintree/payment/:userId
// @ desc POST get payment info from frontend end and send to braintree
// @ return
router.post("/payment/:userId", mwRequireSignin, mwIsAuth, processPayment);


router.param("userId", mwUserById);

module.exports = router;
