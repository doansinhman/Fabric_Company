var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

/* GET users listing. */
function isCookLoggingIn(req) {
    return req.session.type == 'cook';
}
router.get('/', function(req, res, next) {
    if (isCookLoggingIn(req))
        res.redirect('/cook/dashboard');
    else {
        res.redirect('/cook/login');
    }
});
router.get('/login', function(req, res, next) {
    if (isCookLoggingIn(req))
        res.redirect('/cook/dashboard');
    else {
        res.render('./cook/login', { title: "Đầu bếp", userType: req.session.type });
    }
});
router.post('/login', async function(req, res, next) {
    if (isCookLoggingIn(req))
        res.redirect('/cook/dashboard');
    else {
        let user = await utils.Cook.login(req.body.user_name, req.body.password);
        if (!user) {
            res.json(false);
        } else {
            console.log('Log in successfully');
            req.session.user_name = user.user_name;
            console.log('userId = ' + user.id);
            req.session.user = user;
            req.session.type = 'cook';
            res.json(true);
        }
    }
});

router.get('/dashboard', function(req, res, next) {
    if (isCookLoggingIn(req)) {
        res.render('./cook/dashboard', { title: "Đầu bếp", h1: "Smart Food Court System", p: "Trang dành cho Đầu Bếp", userType: req.session.type })
    } else {
        res.redirect('/cook/login');
    }
});

router.get('/service', function(req, res, next) {
    if (isCookLoggingIn(req)) {
        res.render('./cook/service', { title: "Chuẩn bị món ăn", userType: req.session.type })
    } else {
        res.redirect('/cook/login');
    }
});
module.exports = router;