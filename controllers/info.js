var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

var formidable = require('formidable');
var mv = require('mv');
var fs = require('fs');

/* GET users listing. */

router.get('/', function(req, res, next) {
    if (req.session.type) {
        res.render('info', { title: "Thông tin tài khoản", userType: req.session.type });
    } else {
        res.writeHead(404);
        res.end('Login first.');
    }
});

router.post('/get', async function(req, res, next) {
    switch (req.session.type) {
        case "cashier":
            let cashier = new utils.Cashier(req.session.user);
            delete cashier.password;
            res.json(cashier);
            break;
        case "cook":
            let cook = new utils.Cook(req.session.user);
            delete cook.password;
            res.json(cook);
            break;
        case "manager":
            let manager = new utils.Manager(req.session.user);
            delete manager.password;
            res.json(manager);
            break;
        case "member":
            let member = new utils.Member(req.session.user);
            delete member.password;
            res.json(member);
            break;
        case "screen":
            let screen = new utils.Screen(req.session.user);
            delete screen.password;
            res.json(screen);
            break;
        case "vendor":
            let vendor = new utils.Vendor(req.session.user);
            delete vendor.password;
            res.json(vendor);
            break;
        default:
            //
            res.json(null);
            break;
    }
});

router.post('/update', async function(req, res, next) {
    let info = req.body;
    let user_name = req.session.user.user_name;
    let type = req.session.type;

    let success = await utils.User.updateInformation(type, user_name, info);
    if (success) {
        for (key in info) {
            req.session.user[key] = info[key];
        }
        res.json(true);
    } else {
        res.json(false);
    }
});
router.post('/updatePw', async function(req, res, next) {
    console.log(req.body);
    let success = await utils.User.changePassword(req.session.user.user_name, req.session.type, req.body.oldpw, req.body.newpw);
    res.json(success);
});

module.exports = router;