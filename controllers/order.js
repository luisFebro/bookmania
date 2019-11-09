const { Order, CartItem } = require("../models/Order");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    // console.log("CREATE ORDER: ", req.body);
    console.log("req from order", req);
    // req.body.order.user = req.profile;
    // const order = new Order(req.body.order);
    // order.save((error, data) => {
    //     if (error) {
    //         return res.status(400).json({
    //             error: errorHandler(error)
    //         });
    //     }
    //     res.json(data);
    });
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
>>>>>>> 021f8c1093c483f52e258acb63d1ded9dfdbc3c2
};
