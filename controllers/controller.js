var express = require('express');
var router = express.Router();
var model = require('../models/model');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Fabric Company',
        h1: "Fabric Company",
        p: "Cung cấp đa dạng các loại sợi chất lượng cao với giá thành hợp lý.",
        userType: req.session.type
    });
});
router.get('/about', function(req, res, next) {
    res.render('about', {
        userType: req.session.type
    });
});
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err)
            console.log(err);
    })
    res.redirect('/');
});

router.get('/menu', function(req, res, next) {
    res.render('menu', {
        title: 'Mặt hàng',
        userType: req.session.type
    });
});

router.get('/dashboard', function(req, res, next) {
    if (req.session.type) {
        res.redirect('/' + req.session.type + '/dashboard');
    } else {
        res.writeHead(404);
        res.end('Login first.');
    }
});

router.get('/info', function(req, res, next) {
    if (req.session.type) {
        res.render('info', {
            title: 'Thông tin tài khoản',
            userType: req.session.type
        });
    } else {
        res.writeHead(404);
        res.end('Login first.');
    }
});

router.use('/customer', require('./customer'));
router.use('/employee', require('./employee'));
router.use('/manager', require('./manager'));
router.use('/seller', require('./seller'));
router.use('/signup', require('./signup'));

router.use('/api', require('./api/api'))
module.exports = router;