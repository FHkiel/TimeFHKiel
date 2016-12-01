/**
 * Created by Tien on 12/1/2016.
 */
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var taskData = require(path.join(__dirname,'tasks.json'));
var rateData = require(path.join(__dirname,'rates.json'));
var commentData = require(path.join(__dirname,'comments.json'));
var fs = require('fs');
var _ = require('underscore');

var myId = 2;

/* GET home page. */

router.get('/', function(req, res, next){
    var user = 2;
    var filtered = _.where(taskData, {Shared: "True"});
    var filtered2 = _.where(taskData, {Owner: myId});
    var filteredComments = [];
    for(i in filtered) {
        var myChunk = [];
        for(j in commentData) {
            if (filtered[i].TaskId == commentData[j].TaskId) {
                myChunk.push(commentData[j]);
            }
        }
        filteredComments.push(myChunk);
    }
    res.json({'myData' : filtered, 'myData2' : filtered2, 'myComments' : filteredComments, 'user' : user});
});


module.exports = router;

