const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { dbErrorHandler } = require("../helpers/dbErrorHandler");

// MIDDLEWARES - mw
exports.mwPhoto = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.mwProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Produto não encontrado"
            });
        }
        req.product = product;
        next();
    });
};

// @ desc update each product in the order list both subtracting the quantity and increase the number of sales of each.
exports.mwDecreaseQuantity = (req, res, next) => {
    // bulk operations
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } } // n3
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => { // n4
        if (error) {
            return res.status(400).json({
                error: "Could not update product"
            });
        }
        next();
    });
};
// END MIDDLEWARES

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "A imagem não pôde ser armazenada. Tente novamente!"
            });
        }
        // Check for all fields
        const { name, description, price, category, quantity, shipping } = fields
        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "Todos os campos devem ser preenchidos"
            })
        }

        let product = new Product(fields);

        // Photo File Size Reference
        // 1kb = 1000
        // 1mb = 1.000.000

        if (files.photo) {
            // console.log("FILES FOTOS", files.photo);
            if (files.photo > 1000000) {
                return res.status(400).json({
                    error: "O tamanho da imagem deve ser menos de 1mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.staus(400).json({
                    error: dbErrorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.read = (req, res) => {
    // we do not fetch images due to their big size, there is another way in the front end to fetch them.
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: dbErrorHandler(err)
            });
        }
        res.json({
            message: "O produto foi deletado com sucesso!"
        })
    })
}

// This update the whole document. Need all the fields.
exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "O produto não pôde ser atualizado."
            });
        }
        // check for all fields
        // const {
        //     name,
        //     description,
        //     price,
        //     category,
        //     quantity,
        //     shipping
        // } = fields;

        // if (
        //     !name ||
        //     !description ||
        //     !price ||
        //     !category ||
        //     !quantity ||
        //     !shipping
        // ) {
        //     return res.status(400).json({
        //         error: "All fields are required"
        //     });
        // }

        let product = req.product;
        // merging new fields with the current  product
        product = _.extend(product, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: dbErrorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

/**
 * sales (most popular products) / arrival (new products)
 * by sales = api/product/list/all?sortBy=sold&order=desc&limit=4
 * by arrival = api/product/list/all?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.getList = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6; // default

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Produtos não encontrado."
                });
            }
            res.json(products);
        });
};

exports.getListSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: "i" };
        // assigne category value to query.category
        if (req.query.category && req.query.category != "All") {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: dbErrorHandler(err)
                });
            }
            res.json(products);
        }).select("-photo");
    }
};

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */
exports.getListRelated = (req, res) => {
    console.log("getList Related req product", req.product)
    let limit = req.query.limit ? parseInt(req.query.limit) : 6; // 6 by default
    // find this current category from the selected product but not include itself
    Product.find({ _id: { $ne: req.product }, category: req.product.category }) //n1
    .limit(limit)
    .select('-photo') // activate this for better readability in postman
    .populate("category", "_id name")
    .exec((err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Produtos não foram encontrados"
            });
        }
        res.json(products);
    });
};

exports.getListCategory = (req, res) => {
    Product.distinct("category", {}, (err, categories) => { // n2
        if (err) {
            return res.status(400).json({
                error: "Categorias não encontradas"
            });
        }
        res.json(categories);
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

// route - make sure its post / we need body from the front end
// router.post("/products/by/search", listBySearch);

exports.postListBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Produtos não encontrados"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

// n1 - $ne - not included operator (because we do not want to return the targeted selected id product)
/* n2 - .distinct: Finds the distinct values for a specified field across a single collection or view and returns the results in an array.
* eg
{ "_id": 1, "dept": "A", "item": { "sku": "111", "color": "red" }, "sizes": [ "S", "M" ] }
{ "_id": 2, "dept": "A", "item": { "sku": "111", "color": "blue" }, "sizes": [ "M", "L" ] }
{ "_id": 3, "dept": "B", "item": { "sku": "222", "color": "blue" }, "sizes": "S" }
{ "_id": 4, "dept": "A", "item": { "sku": "333", "color": "black" }, "sizes": [ "S" ] }
Inventory.distinct( "dept" )
#
[ "A", "B" ]
*/

// n3 - $ inc operator
/* e.g
DOC:
{
  _id: 1,
  sku: "abc123",
  quantity: 10,
  metrics: {
    orders: 2,
    ratings: 3.5
  }
}
UPDATE:
db.products.update(
   { sku: "abc123" },
   { $inc: { quantity: -2, "metrics.orders": 1 } }
)
AFTER UPDATE:
{
   "_id" : 1,
   "sku" : "abc123",
   "quantity" : 8,
   "metrics" : {
      "orders" : 3,
      "ratings" : 3.5
   }
}
*/


// n4 - bulkWrite - Performs multiple write operations with controls for order of execution.