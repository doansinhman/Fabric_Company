var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

router.get('/', function(req, res, next) {
    if (req.session.type == utils.MANAGER)
        res.redirect('/manager/dashboard');
    else {
        res.redirect('/employee/login');
    }
});

router.get('/dashboard', function(req, res, next) {
    if (req.session.type == utils.MANAGER) {
        res.render('./manager/dashboard', { title: "Quản lí", plt: "none", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

router.get('/manage-product', function(req, res, next) {
    if (req.session.type == utils.MANAGER) {
        res.render('./manager/dashboard', { title: "Quản lí", plt: "manage-product", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

router.get('/manage-employee', function(req, res, next) {
    if (req.session.type == utils.MANAGER) {
        res.render('./manager/dashboard', { title: "Quản lí", plt: "manage-employee", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

router.get('/report', function(req, res, next) {
    if (req.session.type == utils.MANAGER) {
        res.render('./manager/dashboard', { title: "Quản lí", plt: "report", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

module.exports = router;