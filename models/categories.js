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
    child: [Schema.Types.ObjectId],
    parent: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Category', categorySchema);