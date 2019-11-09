const { Order, CartItem } = require("../models/Order");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    // console.log("CREATE ORDER: ", req.body);
    console.log("req from order", req);
    // req.body.order.user = req.profile;
    // const Order = new Order(req.body.order);
    // Order.save((error, data) => {
    //     if (error) {
    //         return res.status(400).json({
    //             error: errorHandler(error)
    //         });
    //     }
    //     res.json(data);
    // });
};
