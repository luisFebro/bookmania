const User = require("../models/user");
const { errorHandler } = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { jwtSecret } = require('../config/keys');

exports.signup = (req, res) => {
    // console.log("req.body", req.body);
    const newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
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


exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "O usuário com este email não existe. Tente novamente!"
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Credenciais Inválidas"
            });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, jwtSecret); // here can also be used expireIn to set expiry date.
        // persist the token as 't' (can be any name) in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 }); // 9999 seconds
        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout success" });
};
