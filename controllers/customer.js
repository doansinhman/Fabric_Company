var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.type == utils.CUSTOMER)
        res.redirect('/customer/dashboard');
    else {
        res.redirect('/customer/login');
    }
});
router.get('/login', function(req, res, next) {
    if (req.session.type == utils.CUSTOMER)
        res.redirect('/customer/dashboard');
    else {
        res.render('./customer/login', { title: "Khách hàng", userType: req.session.type });
    }
});
router.post('/login', async function(req, res, next) {
    if (req.session.type == utils.CUSTOMER)
        res.redirect('/customer/dashboard');
    else {
        model.getCustomerByUsername(req.body.username).then(user => {
            if (user && user[0] && utils.comparePw(req.body.pw, user[0].pw)) {
                console.log(user[0]);
                console.log('Log in successfully');
                console.log('userId = ' + user[0].id);
                req.session.user = user[0];
                req.session.type = utils.CUSTOMER;
                res.json(true);
            } else {
                res.json(false);
            }
        }, err => {
            console.log(err);
        });
    }
});

router.get('/dashboard/', function(req, res, next) {
    if (req.session.type == utils.CUSTOMER) {
        res.render('./customer/dashboard', { title: "Khách hàng", plt: "none", userType: req.session.type })
    } else {
        res.redirect('/customer/login');
    }
});

router.get('/manage-order/', function(req, res, next) {
    if (req.session.type == utils.CUSTOMER) {
        res.render('./customer/dashboard', { title: "Khách hàng", plt: "manage-order", userType: req.session.type })
    } else {
        res.redirect('/customer/login');
    }
});
module.exports = router;