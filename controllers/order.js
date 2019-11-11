const { Order, CartItem } = require("../models/Order");
const { errorHandler } = require("../helpers/dbErrorHandler");

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
        .populate("user", "_id name address")
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