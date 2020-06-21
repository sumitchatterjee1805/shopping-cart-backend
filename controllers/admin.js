const Product = require('../models/products');
const Category = require('../models/categories');

exports.postAddProduct = async (req, res) => {
    try {
        const productObj = {
            product_code: req.body.product_code,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description || null,
            categories: []
        }

        const categoriesList = await Category.find().where('category_code').in(req.body.categories);
        categoriesList.forEach(obj => {
            productObj.categories.push(obj.category_code);
        });

        const product = new Product(productObj);
        await product.save();
        res.status(200).send('Success');
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
};

exports.postAddCategory = async (req, res) => {
    try {
        const categoryObj = {
            category_code: req.body.category_code,
            name: req.body.name,
            child: [],
            parent: []
        };

        const childCategories = await Category.find().where('category_code').in(req.body.child);
        childCategories.forEach(obj => {
            categoryObj.child.push(obj._id);
        });

        const parentCategories = await Category.find().where('category_code').in(req.body.parent);
        parentCategories.forEach(obj => {
            categoryObj.parent.push(obj._id);
        });

        const category = new Category(categoryObj);
        const resp = await category.save();

        await Category.updateMany(
            { category_code: { $in: req.body.child } },
            { $push: { parent: resp._id } }
        );

        await Category.updateMany(
            { category_code: { $in: req.body.parent } },
            { $push: { child: resp._id } }
        );
        return res.status(200).send('Success');
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
}

exports.getCategories = async (req, res) => {
    try {
        const result = await Category.find({ parent: { $exists: true, $size: 0 } });
        const set = new Set();
        result.forEach(cat => {
            if (cat.child)
                cat.child.forEach(child => {
                    set.add(child._id);
                });
        });
        const childResult = await Category.find({ _id: { $in: Array.from(set) } });

        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
}

exports.getProductsByCategory = async (req, res) => {
    try {
        const result = await Product.find({
            categories: req.params.categoryId
        }).select({ product_code: 1, name: 1, price: 1, description: 1, _id: 0 }).sort({ name: 1 });
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
}

exports.editProduct = async (req, res) => {
    try {
        const productObj = {
            product_code: req.body.product_code,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description || null,
            categories: []
        }

        const categoriesList = await Category.find().where('category_code').in(req.body.categories);
        categoriesList.forEach(obj => {
            productObj.categories.push(obj.category_code);
        });

        await Product.updateOne(
            { product_code: req.body.product_code },
            productObj
        );
        return res.status(200).send('Success');
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
}