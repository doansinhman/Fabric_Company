var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utility = require('./utils');
/* 
var formidable = require('formidable');
var mv = require('mv');
var fs = require('fs'); */

/* GET users listing. */
function isCookLoggingIn(req) {
    return req.session.type == 'cook';
}
router.post('/get', async function(req, res, next) {
    if (isCookLoggingIn(req)) {
        res.json(await utility.Service.getFoodsNeedToServiceOfVendor(req.session.user.court_id));
    } else {
        res.json(null);
    }
});
router.post('/put', async function(req, res, next) {
    if (isCookLoggingIn(req)) {
        let data = req.body;
        let food = await utility.Food.getFoodById(data.foodId);
        if (food.court_id == req.session.user.court_id) {
            res.json(await utility.Service.submitPreparedFood(data.foodId, data.count));
        } else {
            res.json(false);
        }
    } else {
        res.json(false);
    }
});

module.exports = router;