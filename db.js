const mongoose = require('mongoose');

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        return;
    } catch (error) {
        throw new Error(error.message);
    }
}