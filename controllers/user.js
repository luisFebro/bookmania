const User = require("../models/User");

// MIDDLEWARES
exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Usuário não encontrado!"
            });
        }
        // user has brings all properties from User Model
        req.profile = user;
        next();
    });
};
