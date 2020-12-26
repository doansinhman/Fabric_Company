var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

router.get('/', function(req, res, next) {
    if (req.session.type == utils.SELLER)
        res.redirect('/seller/dashboard');
    else {
        res.redirect('/employee/login');
    }
});

router.get('/dashboard', function(req, res, next) {
    if (req.session.type == utils.SELLER) {
        res.render('./seller/dashboard', { title: "Nhân viên bán hàng", plt: "none", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

router.get('/manage-order', function(req, res, next) {
    if (req.session.type == utils.SELLER) {
        res.render('./seller/dashboard', { title: "Nhân viên bán hàng", plt: "manage-order", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

module.exports = router;