const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category_code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    child_categories: [this]
});

module.exports = mongoose.model('Category', categorySchema);