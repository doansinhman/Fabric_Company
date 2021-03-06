var express = require('express');
var router = express.Router();
var model = require('../../models/model');
var utils = require('../utils');

router.post('/', async function(req, res, next) {
    let data = req.body;
    switch (data.target) {
        case 'all':
            if (req.session.type == utils.SELLER) {
                model.getAllOrders().then(result => {
                    res.json(result);
                }, err => {
                    res.json(err.sqlMessage);
                });
            } else {
                res.json(false);
            }
            break;
        case 'cusId':
            if (req.session.type == utils.CUSTOMER) {
                model.getAllOrdersOfCustomer(req.session.user.id).then(result => {
                    res.json(result);
                }, err => {
                    res.json(err.sqlMessage);
                });
            } else {
                res.json(false);
            }
            break;
        case 'detail':
            if (req.session.type == utils.SELLER || req.session.type == utils.CUSTOMER) {
                model.getDetailOfOrder(data.value).then(result => {
                    res.json(result);
                }, err => {
                    res.json(err.sqlMessage);
                });
            } else {
                res.json(false);
            }
            break
        case 'released':
            if (req.session.type == utils.SELLER || req.session.type == utils.CUSTOMER) {
                model.getReleasedOfOrder(data.value).then(result => {
                    res.json(result);
                }, err => {
                    res.json(err.sqlMessage);
                });
            } else {
                res.json(false);
            }
            break
        default:
            break;
    }
});

router.post('/insert', async function(req, res, next) {
    let cart = {};
    try {
        cart = JSON.parse(req.body.cart);
    } catch (err) {
        res.json(false);
    }
    if (req.session.type == utils.CUSTOMER) {
        model.insertOrderByCart(cart, req.session.user.id, req.body.address, req.body.note).then(result => {
            console.log('Insert order successfully');
            res.json(true);
        }, err => {
            console.log(err);
            res.json(err.sqlMessage);
        });
    } else {
        res.json(false);
    }
});

router.post('/confirm', async function(req, res, next) {
    if (req.session.type == utils.SELLER) {
        model.confirmOrder(req.body.id, req.session.user.id).then(result => {
            res.json(true);
        }, err => {
            console.log(err);
            res.json(false)
        });
    } else {
        res.json(false);
    }
});

router.post('/cancel', async function(req, res, next) {
    if (req.session.type == utils.SELLER) {
        model.cancelOrder(req.body.id).then(result => {
            res.json(true);
        }, err => {
            console.log(err);
            res.json(false)
        });
    } else {
        res.json(false);
    }
});

router.post('/release', async function(req, res, next) {
    console.log(req.body.release);
    if (req.session.type == utils.SELLER) {
        model.insertReleasement(req.body.id, req.session.user.id, JSON.parse(req.body.release)).then(result => {
            res.json(true);
        }, err => {
            console.log(err);
            res.json(false)
        });
    } else {
        res.json(false);
    }
});



module.exports = router;