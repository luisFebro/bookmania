const Category = require("../models/Category");
const { dbErrorHandler } = require("../helpers/dbErrorHandler");

// MIDDLEWARES - mw
exports.mwCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "A categoria não existe"
            });
        }
        req.category = category;
        next();
    });
};
// END MIDDLEWARES

exports.create = (req, res) => {
    const { name } = req.body
    Category.findOne({ name })
    .then(category => {
        // check if the category already exists
        if(category) return res.status(400).json({ error: "A categoria já existe"})

        const newCategory = new Category(req.body);
        newCategory.save((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: dbErrorHandler(err)
                });
            }
            res.json({ data });
        });
    })
};

exports.read = (req, res) => {
    return res.json(req.category);
}

exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: dbErrorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const category = req.category;
    category.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: dbErrorHandler(err)
            });
        }
        res.json({
            message: "Category deleted"
        });
    });
};

exports.getList = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: dbErrorHandler(err)
            });
        }
        res.json(data);
    });
};




