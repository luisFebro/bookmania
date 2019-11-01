const express = require("express");
const router = express.Router();

const { getUserById } = require("../controllers/user");
const { create, read, update, remove, getList, getCategoryById } = require("../controllers/category");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

// @route  CRUD api/category
router.post("/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/:categoryId", read)
router.delete("/:categoryId/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/:categoryId/:userId", requireSignin, isAuth, isAdmin, update);
router.get("/list/all", getList); // we can not use /categories directly since /:categoryId will be executed. We need one more level

router.param("categoryId", getCategoryById)
router.param("userId", getUserById)

module.exports = router;
