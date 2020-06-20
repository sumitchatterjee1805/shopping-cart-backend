const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, async (err) => {
    if (err)
        console.error("Error in starting server: " + err);
    else {
        console.log("Server started at 8080");
    }
});

module.exports = app;