const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const db = require('./db');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', adminRoutes);

app.use('', (req, res) => {
    res.status(403).send("Invalid URL");
});

db.connect().then(() => {
    app.listen(8080, (err) => {
        if (err)
            console.error("Error in starting server: " + err);
        else {
            console.log("Server started at 8080");
        }
    });
}).catch((err) => {
    console.log("Error in connecting to DB: ", err.message);
});

module.exports = app;