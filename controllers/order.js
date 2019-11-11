const { Order, CartItem } = require("../models/Order");
const { errorHandler } = require("../helpers/dbErrorHandler");

// MIDDLEWARES
exports.mwOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name price") // products.product - this is an array of products which select the fields name and price..
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order = order;
            next();
        });
};
// END MIDDLEWARES

exports.create = (req, res) => {
    // console.log("CREATE ORDER: ", req.body);
    console.log("req from order", req);
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};

exports.getListOrders = (req, res) => {
    Order.find()
        // .populate("user", "_id name address")
        .sort({"createdAt": -1}) // sort most recent orders
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders);
        });
}

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(order);
        }
    );
};
