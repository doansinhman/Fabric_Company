var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

var formidable = require('formidable');
var mv = require('mv');

var JsonToCsv = require('json2csv');
var fs = require('fs');
/* GET users listing. */
function isVendorLoggingIn(req) {
    return req.session.type == 'vendor';
}
router.get('/', function(req, res) {
    if (isVendorLoggingIn(req))
        res.redirect('/vendor/dashboard');
    else {
        res.redirect('/vendor/login');
    }
});
router.get('/login', function(req, res) {
    if (isVendorLoggingIn(req))
        res.redirect('/vendor/dashboard');
    else {
        res.render('./vendor/login', { title: "Nhà cung cấp", userType: req.session.type });
    }
});
router.post('/login', async function(req, res, next) {
    if (isVendorLoggingIn(req))
        res.redirect('/vendor/dashboard');
    else {
        let user = await utils.Vendor.login(req.body.user_name, req.body.password);
        if (!user) {
            res.json(false)
        } else {
            console.log('Log in successfully');
            req.session.userId = user.id;
            console.log('userId = ' + user.id);
            req.session.user = user;
            req.session.type = 'vendor';

            res.json(true);
        }
    }
});
router.get('/dashboard/', function(req, res, next) {
    if (isVendorLoggingIn(req)) {
        res.render('./vendor/dashboard', { title: "Nhà cung cấp", h1: "Smart Food Court System", p: "Trang dành cho nhà cung cấp", userType: req.session.type })
    } else {
        res.redirect('/vendor/login');
    }
});

router.get('/menu/', function(req, res, next) {
    if (isVendorLoggingIn(req)) {
        res.render('./vendor/menu', { title: "Nhà cung cấp", userType: req.session.type })
    } else {
        res.redirect('/vendor/login');
    }
});

router.get('/report', async function(req, res) {
    if (isVendorLoggingIn(req)) {
        let report = await utils.Vendor.getReport(req.session.user.id);

        const csv = await JsonToCsv.parse(report, { fields: ['id', 'name', 'count', 'date', 'amount'] });

        fs.writeFile('report.csv', csv, function(err) {
            if (err) console.log(err);
        });
        //console.log(report);
        try {
            res.render('./report', { title: "Thống kê", report: report });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/vendor/login');
    }
});

router.get('/download', async function(req, res) {
    res.download('./report.csv', 'report.csv');
})

module.exports = router;