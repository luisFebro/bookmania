const { Order, CartItem } = require("../models/Order");
const { dbErrorHandler } = require("../helpers/dbErrorHandler");
const sgMail = require('@sendgrid/mail');

// MIDDLEWARES
exports.mwOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name price") // products.product - this is an array of products which select the fields name and price..
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: dbErrorHandler(err)
                });
            }
            req.order = order;
            next();
        });
};
// END MIDDLEWARES

exports.create = (req, res) => {
    console.log("CREATE ORDER: ", req.body.order);
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: dbErrorHandler(error)
            });
        }
        // send email alert to admin
        sgMail.setApiKey(process.env.SEND_GRID_KEY);
        const msg = {
            //sender
            from: 'BookMania Order Notification <bookmania@gmail.com>',
            //recipients
            isMultiple: true, // the recipients can't see the other ones when this is on
            to: ['babadooweb@gmail.com', 'luis.felipe.bruno@hotmail.com', 'mr.febro@hotmail.com'],
            //
            subject: `A new order is received, Pal`,
            html: `
            <p>Customer name: ${req.profile.name}</p>
            <p>Total products: ${order.products.length}</p>
            <p>Total cost: ${order.amount}</p>
            <p>Login to dashboard to the order in detail.</p>
        `
        };
        sgMail.send(msg)
        .then(() => console.log('Mail sent successfully'))
        .catch(error => console.error(error.toString()));
        // end send email alert to admin
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
                    error: dbErrorHandler(error)
                });
            }
            res.json(orders);
        });
}

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.updateOne( // update itself is depracated.
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: dbErrorHandler(err)
                });
            }
            // console.log("order after update", order)
            res.json(order); // n1
        }
    );
};


// n1
// this is the order's output:
/*
{ n: 1,
[0]   nModified: 1,
[0]   opTime:
[0]    { ts:
[0]       Timestamp { _bsontype: 'Timestamp', low_: 2, high_: 1573435902 },
[0]      t: 5 },
[0]   electionId: 7fffffff0000000000000005,
[0]   ok: 1,
[0]   operationTime:
[0]    Timestamp { _bsontype: 'Timestamp', low_: 2, high_: 1573435902 },
[0]   '$clusterTime':
[0]    { clusterTime:
[0]       Timestamp { _bsontype: 'Timestamp', low_: 2, high_: 1573435902 },
[0]      signature: { hash: [Binary], keyId: [Long] } } }
[0] PUT /api/order/5dc871903b2b781adcc2aa46/status/5dbf0f0b5bf94a25249b31dc 200 884.032 ms - 285
[0] OPTIONS /api/order/list/all/5dbf0f0b5bf94a25249b31dc 2
 */

// req.body got the actual data
/*
{ status: 'Processing',
[0]   _id: 5dc871903b2b781adcc2aa46,
[0]   products:
[0]    [ { _id: 5dc00a28631d8810181eba6e,
[0]        name: 'Railsfdds',
[0]        price: 100,
[0]        createdAt: 2019-11-04T11:23:20.949Z,
[0]        updatedAt: 2019-11-04T11:23:20.949Z,
[0]        __v: 0,
[0]        count: 5 },
[0]      { _id: 5dc01114b75b9b233c150c32,
[0]        name: 'Atari',
[0]        price: 1222,
[0]        createdAt: 2019-11-04T11:52:52.518Z,
[0]        updatedAt: 2019-11-04T11:52:52.518Z,
[0]        __v: 0,
[0]        count: 3 } ],
[0]   transaction_id: 'fqp39htv',
[0]   amount: 4166,
[0]   address: 'Rua da Indústria, N* 13 B - Compensa 1',
[0]   user: 5dc2156aa48a0a1e70b252b7,
[0]   createdAt: 2019-11-10T20:22:40.129Z,
[0]   updatedAt: 2019-11-11T01:24:41.153Z,
[0]   __v: 0 }
 */