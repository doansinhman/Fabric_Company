var express = require('express');
var router = express.Router();
var model = require('../../models/model');

router.use('/product', require('./product'));
router.use('/order', require('./order'));

module.exports = router;