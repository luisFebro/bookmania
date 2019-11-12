const User = require("../models/User");
const { Order, CartItem } = require("../models/Order");
const { dbErrorHandler } = require("../helpers/dbErrorHandler");

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

exports.mwAddOrderToUserHistory = (req, res, next) => {
    let history = [];

    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        });
    });

    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { history: history } },
        { new: true }, // immediate JSON response
        (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: "Could not update user purchase history"
                });
            }
            next();
        }
    );
};
// END MIDDLEWARE

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

exports.getListFavorite = (req, res) => {
    Product.distinct("favoriteList", {}, (err, categories) => { // n2
        if (err) {
            return res.status(400).json({
                error: "Categorias não encontradas"
            });
        }
        res.json(categories);
    });
};

exports.getListPurchaseHistory = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate("user", "_id name")
        .sort({createAt: -1})
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: dbErrorHandler(err)
                });
            }
            res.json(orders);
        });
};

