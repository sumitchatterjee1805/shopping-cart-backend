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
            productObj.categories.push(obj._id);
        });

        if (productObj.categories.length === 0)
            delete productObj.categories;

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
            child_categories: []
        };

        const childCategories = await Category.find().where('category_code').in(req.body.child_categories);
        childCategories.forEach(obj => {
            categoryObj.child_categories.push(obj);
        });

        if (categoryObj.child_categories.length === 0)
            delete categoryObj.child_categories;

        const category = new Category(categoryObj);
        const resp = await category.save();
        
        await Category.updateMany(
            { category_code: { $in: req.body.parent_categories } },
            { $push: { child_categories: resp } }
        );
        return res.status(200).send('Success');
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
}