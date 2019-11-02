const express = require("express");
const router = express.Router();

const {
    requireSignin,
    mwIsAuth,
    mwIsAdmin
} = require("../controllers/auth");

const {
    read,
    update,
    getListFavorite,
    mwUserById
} = require("../controllers/user");

// this requires two headers: application/json and Bearer [token]
// With the token approved, the authorized user can access other user's profiles too.
// But with mwIsAuth we limit this access and the user can only have access to his/her profile.
// With mwIsAdmin on, only admin can have access.
// @route   GET api/user
router.get("/secret/:userId", requireSignin, mwIsAuth, mwIsAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});

// @route  api/user
router.get("/:userId", requireSignin, mwIsAuth, read);
router.put("/:userId", requireSignin, mwIsAuth, update);
router.get("/list/favorite/:userId", getListFavorite);

// Everytime there is a userId, this router will run and make this user info available in the request object
router.param("userId", mwUserById);

module.exports = router;
