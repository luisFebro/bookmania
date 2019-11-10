const express = require("express");
const router = express.Router();

const { mwUserById } = require("../controllers/user");
const { create, read, update, remove, getList, mwCategoryById } = require("../controllers/category");
const { mwRequireSignin, mwIsAuth, mwIsAdmin } = require("../controllers/auth");

// @route  CRUD api/category
router.post("/:userId", mwRequireSignin, mwIsAuth, mwIsAdmin, create);
router.get("/:categoryId", read)
router.delete("/:categoryId/:userId", mwRequireSignin, mwIsAuth, mwIsAdmin, remove);
router.put("/:categoryId/:userId", mwRequireSignin, mwIsAuth, mwIsAdmin, update);

router.get("/list/all", getList); // we can not use /categories directly since /:categoryId will be executed. We need one more level

router.param("categoryId", mwCategoryById)
router.param("userId", mwUserById)

module.exports = router;
