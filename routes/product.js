const express = require("express");
const router = express.Router();

const { createProduct, productById, read } = require("../controllers/product");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/:productId", read); // Read a File
router.post("/create/:userId", requireSignin, isAdmin, isAdmin, createProduct);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;