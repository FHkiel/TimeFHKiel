/**
 * Created by moham on 11/29/2016.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var fs2 = require('fs');
var fs3 = require('fs');
var PDFParser = require("pdf2json");
var pdfParser = new PDFParser();
var theFileName ='';
var origFileName = '';
var theFileExt = '';
var timetable = [];
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


router.post('/', function(req, res) {


    res.json({"name":"java", "detail":"morning", "sTime":"2016-10-10T13:15:00", "eTime":"2016-10-10T15:15:00"});

});

module.exports = router