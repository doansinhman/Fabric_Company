var express = require('express');
var router = express.Router();
var model = require('../../models/model');
var utils = require('../utils');

var formidable = require('formidable');
var mv = require('mv');
var fs = require('fs');
const { json } = require('body-parser');

router.post('/get', async function(req, res, next) {
    if (utils.EMPLOYEE.includes(req.session.type)) {
        model.getEmployeeById(req.session.user.id).then(result => {
            let user = result[0];
            delete user.pw;
            res.json(user);
        }, err => {
            res.json(err.sqlMessage);
        })
    } else if (req.session.type == utils.CUSTOMER) {
        model.getCustomerById(req.session.user.id).then(result => {
            let user = result[0];
            delete user.pw;
            delete user.oweLimit;
            res.json(user);
        }, err => {
            res.json(err.sqlMessage);
        })
    } else {
        res.json(null);
    }
});

router.post('/update', async function(req, res, next) {
    if (req.session.type == utils.CUSTOMER) {
        model.updateCustomer(req.session.user.id, req.body).then(result => {
            res.json(true);
        }, err => {
            res.json(err.sqlMessage);
        })
    } else if (utils.EMPLOYEE.includes(req.session.type)) {
        console.log(req.body);
        model.updateEmployee(req.session.user.id, req.body).then(result => {
            res.json(true);
        }, err => {
            res.json(err.sqlMessage);
        })
    } else {
        res.json(false);
    }
});
router.post('/updatePw', async function(req, res, next) {
    if (req.session.type == utils.CUSTOMER) {
        model.getCustomerById(req.session.user.id).then(result => {
            let cus = result[0];
            if (!utils.comparePw(req.body.oldpw, cus.pw))
                res.json('Mật khẩu cũ không đúng.')
            else {
                model.updateCustomerPw(req.session.user.id, req.body.newpw).then(result => {
                    res.json(true);
                }, err => {
                    res.json(err.sqlMessage);
                });
            }
        }, err => {
            res.json(err.sqlMessage);
        });
    } else if (utils.EMPLOYEE.includes(req.session.type)) {
        model.getEmployeeById(req.session.user.id).then(result => {
            let emp = result[0];
            if (!utils.comparePw(req.body.oldpw, emp.pw))
                res.json('Mật khẩu cũ không đúng.')
            else {
                model.updateEmployeePw(req.session.user.id, req.body.newpw).then(result => {
                    res.json(true);
                }, err => {
                    res.json(err.sqlMessage);
                });
            }
        }, err => {
            res.json(err.sqlMessage);
        });
    }
});

module.exports = router;