const express = require("express");
const router = express.Router();

const { create, read, remove, update, getList, getListRelated, getProductById } = require("../controllers/product");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// CRUD
// @route  CRUD api/product
router.get("/:productId", read);
router.post("/:userId", requireSignin, isAdmin, isAdmin, create);
router.delete("/:productId/:userId", requireSignin, isAuth, isAdmin, remove); // user is requested here because it makes sure that only an admin account can delete a product.
router.put("/:productId/:userId", requireSignin, isAuth, isAdmin, update);
// END CRUD
router.get("/list/all", getList);
router.get("/list/related-products", getListRelated);

router.param("userId", getUserById);
router.param("productId", getProductById);

module.exports = router;