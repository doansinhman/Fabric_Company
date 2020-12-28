var express = require('express');
var router = express.Router();
var model = require('../../models/model');
var utils = require('../utils');

var formidable = require('formidable');
var mv = require('mv');
var fs = require('fs');
const { json } = require('body-parser');
const { cpuUsage } = require('process');

router.post('/', async function(req, res, next) {
    switch (req.session.type) {
        case utils.WAREHOUSE:
            model.getAllShipmentsOfWarehouse(req.session.user.id).then(result => {
                res.json(result);
            }, err => {
                res.json(err.sqlMessage);
            });
            break;
        case utils.SHIP_DEPT:
            model.getAllShipmentsOfShipDept(req.session.user.id).then(result => {
                res.json(result);
            }, err => {
                res.json(err.sqlMessage);
            });
            break;
        default:
            break;
    }
});


router.post('/unship', async function(req, res, next) {
    if (req.session.type == utils.WAREHOUSE) {
        model.getAllUnships().then(result => {
            res.json(result);
        }, err => {
            res.json(err.sqlMessage);
        });
    } else {
        res.json(false);
    }
});

router.post('/insert', async function(req, res, next) {
    let ship = {};
    try {
        ship = JSON.parse(req.body.ship);
    } catch (err) {
        return res.json(false);
    }
    if (ship == null || req.body.ship == '{}')
        return res.json(false);
    console.log(ship);
    if (req.session.type == utils.WAREHOUSE) {
        model.insertShipment(ship, req.session.user.id, req.body.sdid).then(result => {
            console.log('Insert shipment successfully');
            res.json(true);
        }, err => {
            console.log(err);
            res.json(err.sqlMessage);
        });
    } else {
        res.json(false);
    }
});

router.post('/ship_department', async function(req, res, next) {
    if (req.session.type == utils.WAREHOUSE) {
        model.getAllShipDepts().then(result => {
            res.json(result)
        }, err => {
            res.json(err.sqlMessage);
        });
    } else {
        res.json(false);
    }
});

router.post('/details', async function(req, res, next) {
    if (req.session.type == utils.WAREHOUSE || req.session.type == utils.SHIP_DEPT) {
        model.getDetailsOfShipment(req.body.id).then(result => {
            res.json(result)
        }, err => {
            res.json(err.sqlMessage);
        });
    } else {
        res.json(false);
    }
});

router.post('/start', async function(req, res, next) {
    if (req.session.type == utils.SHIP_DEPT) {
        model.triggerStartShipment(req.body.id, req.session.user.id).then(result => {
            res.json(result)
        }, err => {
            res.json(err.sqlMessage);
        });
    } else {
        res.json(false);
    }
});

router.post('/finish', async function(req, res, next) {
    if (req.session.type == utils.SHIP_DEPT) {
        model.triggerFinishShipment(req.body.id, req.session.user.id).then(result => {
            res.json(result)
        }, err => {
            res.json(err.sqlMessage);
        });
    } else {
        res.json(false);
    }
});


router.post('/locate', async function(req, res, next) {
    console.log(req.body.position);
    if (req.session.type == utils.SHIP_DEPT) {
        model.triggerLocateShipment(req.body.id, req.body.position, req.session.user.id).then(result => {
            res.json(result)
        }, err => {
            res.json(err.sqlMessage);
        });
    } else {
        res.json(false);
    }
});

module.exports = router;