const express = require("express");
const router = express.Router();

const { userById } = require("../controllers/user");
const { createCategory } = require("../controllers/category");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.post("/create/:userId", requireSignin, isAuth, isAdmin, createCategory);

router.param("userId", userById)
module.exports = router;
