const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { dbErrorHandler } = require("../helpers/dbErrorHandler");

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
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !quantity ||
            !shipping
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let product = req.product;
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

// MIDDLEWARES
exports.getProductById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Produto não encontrado"
            });
        }
        req.product = product;
        next();
    });
};
// END MIDDLEWARES