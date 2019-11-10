const User = require("../models/User");

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

// OFFICIAL WAY TO UPDATE - this allow to update by field and return the updated response in immediately
exports.update = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true }, // immediately updated! this send the most recently updated response/doc from database to app
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "Você não está autorizado para executar esta ação"
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }
    );
};

// exports.getListFavorite = (req, res) => {
//     Product.distinct("favoriteList", {}, (err, categories) => { // n2
//         if (err) {
//             return res.status(400).json({
//                 error: "Categorias não encontradas"
//             });
//         }
//         res.json(categories);
//     });
// };


// MIDDLEWARES - mw
exports.mwUserById = (req, res, next, id) => {
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
// END MIDDLEWARE

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    });
};



// exports.read = (req, res) => {
//     req.profile.hashed_password = undefined;
//     req.profile.salt = undefined;
//     return res.json(req.profile);
// };

// exports.update = (req, res) => {
//     User.findOneAndUpdate(
//         { _id: req.profile._id },
//         { $set: req.body },
//         { new: true },
//         (err, user) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: "You are not authorized to perform this action"
//                 });
//             }
//             user.hashed_password = undefined;
//             user.salt = undefined;
//             res.json(user);
//         }
//     );
// };
