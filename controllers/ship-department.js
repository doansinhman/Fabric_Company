var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.type == utils.SHIP_DEPT)
        res.redirect('/ship-department/dashboard');
    else {
        res.redirect('/ship-department/login');
    }
});
router.get('/login', function(req, res, next) {
    if (req.session.type == utils.SHIP_DEPT)
        res.redirect('/ship-department/dashboard');
    else {
        res.render('./ship-department/login', { title: "Đơn vị vận chuyển", userType: req.session.type });
    }
});
router.post('/login', async function(req, res, next) {
    if (req.session.type == utils.SHIP_DEPT)
        res.redirect('/ship-department/dashboard');
    else {
        model.getShipDeptByUsername(req.body.username).then(user => {
            if (user && user[0] && utils.comparePw(req.body.pw, user[0].pw)) {
                console.log(user[0]);
                console.log('Log in successfully');
                console.log('userId = ' + user[0].id);
                req.session.user = user[0];
                req.session.type = utils.SHIP_DEPT;
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
    if (req.session.type == utils.SHIP_DEPT) {
        res.render('./ship-department/dashboard', { title: "Đơn vị vận chuyển", plt: 'none', userType: req.session.type })
    } else {
        res.redirect('/ship-department/login');
    }
});

router.get('/manage-shipment', function(req, res, next) {
    if (req.session.type == utils.SHIP_DEPT) {
        res.render('./ship-department/dashboard', { title: "Đơn vị vận chuyển", plt: 'manage-shipment', userType: req.session.type })
    } else {
        res.redirect('/ship-department/login');
    }
});
module.exports = router;