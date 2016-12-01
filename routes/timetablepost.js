/**
 * Created by moham on 11/29/2016.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
var data = [{"id":"14","title":"you have java","start":"2016-11-30T10:15:00","end":"2016-11-30T11:15:00","allDay":false},
    {"id":"15","title":"you have bala","start":"2016-11-30T13:15:00","end":"2016-11-30T14:15:00","allDay":false}];

function getData(){

}
router.post('/', function(req, res) {


   res.json(data);

});

module.exports = router