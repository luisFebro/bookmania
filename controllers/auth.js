const User = require('../models/User');
const { dbErrorHandler } = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check

// MIDDLEWARES - mw
// Require signin Middleware - create privite route
// This requires the cookie-parser
// About express-jwt: Middleware that validates JsonWebTokens and sets req.user.
// This module lets you authenticate HTTP requests using JWT tokens in your Node.js applications. JWTs are typically used to protect API endpoints, and are often issued using OpenID Connect.
exports.mwRequireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.mwIsAuth = (req, res, next) => {
    //req.auth from userProperty in mwRequireSignin above.
    // compares the current data from profile with authorization token.
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({ // html code for Forbidden
            error: "Acesso Negado"
        });
    }
    next();
};

exports.mwIsAdmin = (req, res, next) => {
    // if regular user, then deny access.
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Recurso Admin! Acesso negado"
        });
    }
    next();
};
// END MIDDLEWARES


exports.signup = (req, res) => {
    // console.log("req.body", req.body);
    const newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: dbErrorHandler(err)
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
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET); // here can also be used expireIn to set expiry date.
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




