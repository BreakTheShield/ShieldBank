var express = require('express');
var router = express.Router();

var view = require("./view");
var transfer = require("./transfer");
var total = require("./total");

router.use('/total',total);
router.use('/view', view);
router.use('/transfer', transfer);

module.exports = router;
