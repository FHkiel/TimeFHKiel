/**
 * Created by moham on 11/25/2016.
 */
var express = require('express');
var router = express.Router();
var app = angular.module('App', ['ui.calendar'])
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('timetable', { title: 'Express' });
});

module.exports = router;
