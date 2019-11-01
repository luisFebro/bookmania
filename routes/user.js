const express = require("express");
const router = express.Router();

const { requireSignin, mwIsAuth, mwIsAdmin } = require("../controllers/auth");

const { mwUserById } = require("../controllers/user");

// this requires two headers: application/json and Bearer [token]
// With the token approved, the authorized user can access other user's profiles too.
// But with mwIsAuth we limit this access and the user can only have access to his/her profile.
// With mwIsAdmin on, only admin can have access.
router.get("/secret/:userId", requireSignin, mwIsAuth, mwIsAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});

// Everytime there is a userId, this router will run and make this user info available in the request object
router.param("userId", mwUserById);

module.exports = router;
