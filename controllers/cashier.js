var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

router.get('/', function(req, res, next) {
    if (req.session.type == utils.CASHIER)
        res.redirect('/cashier/dashboard');
    else {
        res.redirect('/employee/login');
    }
});

router.get('/dashboard', function(req, res, next) {
    if (req.session.type == utils.CASHIER) {
        res.render('./cashier/dashboard', { title: "Thu ngân", plt: "none", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

router.get('/manage-receipt', function(req, res, next) {
    if (req.session.type == utils.CASHIER) {
        res.render('./cashier/dashboard', { title: "Thu ngân", plt: "manage-receipt", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

router.get('/manage-payment', function(req, res, next) {
    if (req.session.type == utils.CASHIER) {
        res.render('./cashier/dashboard', { title: "Thu ngân", plt: "manage-payment", userType: req.session.type })
    } else {
        res.redirect('/employee/login');
    }
});

router.post('/receipt', async function(req, res, next) {
    if (req.session.type == utils.CASHIER) {
        model.getAllReceipts().then(result => {
            res.json(result);
        }, err => {
            res.json(err.sqlMessage);
        })
    } else {
        res.json(false);
    }
});

router.post('/payment', async function(req, res, next) {
    if (req.session.type == utils.CASHIER) {
        model.getAllPayments().then(result => {
            res.json(result);
        }, err => {
            res.json(err.sqlMessage);
        })
    } else {
        res.json(false);
    }
});

router.post('/receipt/insert', async function(req, res, next) {
    if (req.session.type == utils.CASHIER) {
        model.insertReceipt(req.body.amount, req.body.cusId, req.session.user.id).then(result => {
            res.json(result);
        }, err => {
            res.json(err.sqlMessage);
        })
    } else {
        res.json(false);
    }
});

router.post('/payment/insert', async function(req, res, next) {
    if (req.session.type == utils.CASHIER) {
        model.insertPayment(req.body.amount, req.body.goal, req.session.user.id).then(result => {
            res.json(result);
        }, err => {
            res.json(err.sqlMessage);
        })
    } else {
        res.json(false);
    }
});

module.exports = router;