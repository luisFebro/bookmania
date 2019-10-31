const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const { userById } = require("../controllers/user");

// this requires two headers: application/json and Bearer [token]
// With the token approved, the authorized user can access other user's profiles too.
// But with isAuth we limit this access and the user can only have access to his/her profile.
router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});

// Everytime there is a userId, this router will run and make this user info available in the request object
router.param("userId", userById);

module.exports = router;
