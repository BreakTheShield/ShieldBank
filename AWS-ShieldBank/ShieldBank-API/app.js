const express = require("express");
const app = express();
const index = require('./routes/index');
var logger = require('morgan');





app.use(express.json());

app.use('/api', index);
app.use(logger('dev'));

module.exports = app;
