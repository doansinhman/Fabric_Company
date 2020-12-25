var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('./customer/signup', { title: "Đăng kí khách hàng", userType: req.session.type });
});
router.post('/', async function(req, res, next) {
    model.insertCustomer(req.body).then(result => {
        res.json({ messageType: utils.SUCCESS, message: 'Đăng kí thành công.' });
    }, err => {
        console.log(err);
        if (err.errno == 1062) {
            err.sqlMessage = 'Username không khả dụng.'
        }
        res.json({ messageType: utils.DANGER, message: err.sqlMessage });
    })
});
module.exports = router;