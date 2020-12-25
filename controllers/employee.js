var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (utils.EMPLOYEE.includes(req.session.type))
        res.redirect('/' + req.session.type.toLowerCase() + '/dashboard');
    else {
        res.redirect('/employee/login');
    }
});
router.get('/login', function(req, res, next) {
    if (utils.EMPLOYEE.includes(req.session.type))
        res.redirect('/' + req.session.type.toLowerCase() + '/dashboard');
    else {
        res.render('./employee/login', { title: "Nhân viên", userType: req.session.type });
    }
});
router.post('/login', async function(req, res, next) {
    if (utils.EMPLOYEE.includes(req.session.type))
        res.redirect('/' + req.session.type.toLowerCase() + '/dashboard');
    else {
        console.log(req.body);
        model.getEmployeeByUsername(req.body.username).then(user => {
            if (user && user[0] && utils.comparePw(req.body.pw, user[0].pw)) {
                console.log('Log in successfully');
                console.log('userId = ' + user[0].id);
                req.session.user = user[0];
                req.session.type = user[0].type;
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
    console.log(req.session.type);
    if (utils.EMPLOYEE.includes(req.session.type)) {
        console.log('include');
        res.redirect('/' + req.session.type.toLowerCase() + '/dashboard');
    } else {
        res.redirect('/employee/login');
    }
});
module.exports = router;