var express = require('express');
var router = express.Router();
var model = require('../../models/model');
var utils = require('../utils');

var formidable = require('formidable');
var mv = require('mv');
var fs = require('fs');

router.post('/', async function(req, res, next) {
    let data = req.body;
    switch (data.target) {
        case 'all':
            model.getAllProducts().then(result => {
                res.json(result);
            }, err => {
                res.json(err.sqlMessage);
            })
            break;
        default:
            break;
    }
});

router.post('/insert', async function(req, res, next) {
    if (req.session.type == utils.MANAGER) {
        var form = new formidable.IncomingForm();
        form.parse(req, async function(err, fields, files) {
            let oldpath = files.fileToUpload.path;
            let ex = files.fileToUpload.name.split('.');
            ex = '.' + ex[ex.length - 1];
            fields.image = ex;
            model.insertProductAndGetId(fields).then(result => {
                console.log('uploading image');
                var newpath = './public/images/product/' + result[0].id + ex;
                mv(oldpath, newpath, function(err) {
                    if (err) throw err;
                    res.redirect('/manager/manage-product');
                });
            }, err => {
                console.log(err);
                res.redirect('/manager/manage-product');
            });
        });
    } else {
        res.redirect('/employee/login');
    }
});

router.post('/delete', async function(req, res, next) {
    if (req.session.type == utils.MANAGER) {
        model.deleteProductByIdAndImage(req.body.id, req.body.image).then(result => {
            fs.unlink('./public/images/product/' + req.body.id + req.body.image, (err) => {
                if (err) {
                    console.error(err)
                }
            });
            res.json(true);
        }, err => {
            console.log(err);
            res.json(false)
        })
    } else {
        res.json(false);
    }
});

router.post('/update', async function(req, res, next) {
    if (req.session.type == utils.MANAGER) {
        //console.log('yes');
        var form = new formidable.IncomingForm();
        form.parse(req, async function(err, fields, files) {
            if (files.fileToUpload.size) {
                let ex = files.fileToUpload.name.split('.');
                ex = '.' + ex[ex.length - 1];
                fields.image = ex;
            }
            console.log(fields);
            model.updateProductAndGetImage(fields).then(result => {
                if (files.fileToUpload.size) {
                    console.log('uploading');
                    let oldpath = files.fileToUpload.path;
                    let newpath = './public/images/product/' + fields.id + fields.image;
                    mv(oldpath, newpath, function(err) {
                        if (err) throw err;
                    });
                    if (fields.image != result[0].image) {
                        fs.unlink('./public/images/product/' + fields.id + result[0].image, (err) => {
                            if (err) {
                                console.error(err)
                            }
                        });
                    }
                }
            }, err => {
                console.log(err)

            })
            return res.redirect('/manager/manage-product');
        });
    } else {
        res.json(false);
    }
});


module.exports = router;