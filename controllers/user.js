const User = require("../models/user");
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.signup = (req, res) => {
    // console.log("req.body", req.body);
    const newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        // Not includes sensitive password
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};
