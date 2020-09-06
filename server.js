const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

var http = require("http");

require("dotenv-safe").config();

var jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./app/routes/routes.js')(app);

// console.log(config);

// listen for requests
app.listen(config.Port,config.ServerHost, () => {
    console.log(`Server is listening on port ${config.Port}`);
});

module.exports = app; // for testing
