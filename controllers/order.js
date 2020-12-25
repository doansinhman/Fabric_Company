var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utils = require('./utils');

/* GET users listing. */
function isScreenLoggingIn(req) {
    return req.session.type == 'screen';
}

function isMemberLoggingIn(req) {
    return req.session.type == 'member';
}

function isCashierLoggingIn(req) {
    return req.session.type == 'cashier';
}

router.get('/', function(req, res, next) {
    if (req.session.type != utils.CUSTOMER) {
        res.render('alert', {
            title: "Đặt hàng",
            message: "Bạn cần đăng nhập để thực hiện đặt hàng.",
            messageStatus: "danger",
            messageStrong: "Thất bại!"
        });
    } else if (isScreenLoggingIn(req)) {
        res.render('./order/screen', {
            title: 'Thanh toán'
        })
    } else if (isMemberLoggingIn(req)) {
        res.render('./order/member', {
            title: 'Thanh toán'
        })
    }
});
router.get('/status', function(req, res, next) {
    res.render('./order/status', { title: 'Trạng thái đơn hàng' });
});
router.post('/get', async function(req, res, next) {
    if (isCashierLoggingIn(req)) {
        res.json(await utils.Order.getOrder(req.body.id));
    } else {
        res.json(null);
    }
});
router.post('/confirm', async function(req, res, next) {
    //console.log(req.session.userId);
    if (isCashierLoggingIn(req)) {
        res.json(await utils.Order.confirmOrder(req.session.user_name, req.body.id, new Date().toISOString()));
    } else {
        res.json(null);
    }
});
router.post('/spot-cash', async function(req, res, next) {
    if (isScreenLoggingIn(req)) {
        console.log(req.body.cart);
        let cart = {};
        try {
            cart = JSON.parse(req.body.cart);

            let unavailable = [];
            for (key in cart) {
                let food = await utils.Food.getFoodById(key);
                if (!food.available) {
                    unavailable.push(key);
                }
            }
            if (unavailable.length) {
                res.json({ success: false, unavailable: unavailable });
                console.log('unavailable');
            } else {
                let id = await utils.Order.createOrder(cart, new Date().toISOString());
                res.json({ success: true, id: id });
                console.log('successs');
            }
        } catch (e) {
            console.log('err');
            console.log(e);
            res.json({ success: false });
        }
    } else {
        res.json({ success: false });
    }
});

router.post('/status', async function(req, res, next) {
    res.json(await utils.Order.getOrderStatus());
});

//check
router.get('/slip/:order_id', async function(req, res, next) {
    //console.log(req.params);
    if (isScreenLoggingIn(req) || isCashierLoggingIn(req)) {
        let order = await utils.Order.getOrder(req.params.order_id);
        res.render('./order/slip', { id: req.params.order_id, date: order.date, cart: order.cart });
    } else {
        res.end('404');
    }
});

module.exports = router;