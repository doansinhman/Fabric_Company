var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

router.get('/', function(req, res, next) {
    if (req.session.type == utils.WAREHOUSE)
        res.redirect('/warehouse/dashboard');
    else {
        res.redirect('/employee/login');
    }
});

router.get('/dashboard', function(req, res, next) {
    if (req.session.type == utils.WAREHOUSE) {
        res.render('./warehouse/dashboard', { title: "Nhân viên kho bãi", plt: "none", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

router.get('/manage-shipment', function(req, res, next) {
    if (req.session.type == utils.WAREHOUSE) {
        res.render('./warehouse/dashboard', { title: "Nhân viên kho bãi", plt: "manage-shipment", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

router.get('/create-shipment', function(req, res, next) {
    if (req.session.type == utils.WAREHOUSE) {
        res.render('./warehouse/dashboard', { title: "Nhân viên kho bãi", plt: "create-shipment", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

module.exports = router;