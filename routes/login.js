/**
 * Created by moham on 12/2/2016.
 */
var express = require('express');
var router = express.Router();

var app = require('express')();

var data;
var fs = require('fs');


router.get('/', function(req, res, next) {
    res.render('login.ejs', { title: 'Express' });
});



module.exports = router;

