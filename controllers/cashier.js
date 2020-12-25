var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

/* GET users listing. */
function isCashierLoggingIn(req) {
    return req.session.type == 'cashier';
}
router.get('/', function(req, res, next) {
    if (isCashierLoggingIn(req))
        res.redirect('/cashier/dashboard');
    else {
        res.redirect('/cashier/login');
    }
});
router.get('/login', function(req, res, next) {
    if (isCashierLoggingIn(req))
        res.redirect('/cashier/dashboard');
    else {
        res.render('./cashier/login', { title: "Thu ngân", userType: req.session.type });
    }
});
router.post('/login', async function(req, res, next) {
    if (isCashierLoggingIn(req))
        res.redirect('/cashier/dashboard');
    else {
        let user = await utils.Cashier.login(req.body.user_name, req.body.password);
        if (!user) {
            res.json(false);
        } else {
            console.log('Log in successfully');
            req.session.user_name = user.user_name;
            console.log('userId = ' + user.id);
            req.session.user = user;
            req.session.type = 'cashier';
            res.json(true);
        }
    }
});

router.get('/dashboard', function(req, res, next) {
    if (isCashierLoggingIn(req)) {
        res.render('./cashier/dashboard', { title: "Thu ngân", h1: "Smart Food Court System", p: "Trang dành cho Thu ngân", userType: req.session.type })
    } else {
        res.redirect('/cashier/login');
    }
});

router.get('/order', function(req, res, next) {
    if (isCashierLoggingIn(req)) {
        res.render('./cashier/order', { title: "Kiểm tra đơn hàng", userType: req.session.type })
    } else {
        res.redirect('/cashier/login');
    }
});
module.exports = router;