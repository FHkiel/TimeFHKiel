var express = require('express');
var router = express.Router();

var app = require('express')();

var data;
var fs = require('fs');


router.get('/', function(req, res, next) {
  res.render('chat', { title: 'Express' });
});



module.exports = router;

