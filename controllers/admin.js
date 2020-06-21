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
const catObjList = {};
exports.getCategories = async (req, res) => {
    try {
        const result = await Category.find({ parent: { $exists: true, $size: 0 } });
        const set = new Set();
        const response = [];
        const cat_array = [];

        for(let i = 0; i < result.length; i++) {
            const cat = result[i];
            const obj = {
                category_code: cat.category_code,
                name: cat.name,
                child_categories: []
            }

            if (cat.child)
                cat.child.forEach(child => {
                    set.add(child._id);
                });
            if (set.size > 0) {
                const childObj = await getChildCategory(Array.from(set));
                obj.child_categories.push(...childObj);
            }
            response.push(obj);
        }
        // const childResult = await Category.find({ _id: { $in: Array.from(set) } });

        return res.status(200).send(response);
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

const getChildCategory = async (category) => {
    const set = new Set();
    const response = [];
    const result = await Category.find().where('_id').in(category);
    
    for(let i = 0; i < result.length; i++) {
        const cat = result[i];
        const obj = {
            category_code: cat.category_code,
            name: cat.name,
            child_categories: []
        }

        if (cat.child)
            cat.child.forEach(child => {
                set.add(child._id);
            });
        if (set.size > 0) {
            const childObj = await getChildCategory(Array.from(set));
            obj.child_categories.push(...childObj);
        }
        response.push(obj);
    }
    console.log(response);
    return response;
}