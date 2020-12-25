var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

/* GET users listing. */
function isScreenLoggingIn(req) {
    return req.session.type == 'screen';
}
router.get('/', function(req, res, next) {
    if (isScreenLoggingIn(req))
        res.redirect('/screen/dashboard');
    else {
        res.redirect('/screen/login');
    }
});
router.get('/login', function(req, res, next) {
    if (isScreenLoggingIn(req))
        res.redirect('/screen/dashboard');
    else {
        res.render('./screen/login', { title: "Màn hình", userType: req.session.type });
    }
});
router.post('/login', async function(req, res, next) {
    if (isScreenLoggingIn(req))
        res.redirect('/screen/dashboard');
    else {
        let user = await utils.Screen.login(req.body.user_name, req.body.password);
        if (!user) {
            res.json(false);
        } else {
            console.log('Log in successfully');
            req.session.userId = user.id;
            console.log('userId = ' + user.id);
            req.session.user = user;
            req.session.type = 'screen';
            res.json(true);
        }
    }
});

router.get('/dashboard', function(req, res, next) {
    if (isScreenLoggingIn(req)) {
        res.render('./screen/dashboard', { title: "Màn hình", h1: "Smart Food Court System", p: "Trang dành cho Màn hình", userType: req.session.type })
    } else {
        res.redirect('/screen/login');
    }
});


module.exports = router;