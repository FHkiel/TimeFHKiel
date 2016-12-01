/**
 * Created by Hai on 11/19/2016.
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
router.get('/', function(req, res, next) {
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
    res.render('SharedTasks', {'myData' : filtered, 'myData2' : filtered2, 'myComments' : filteredComments, 'user' : user});
});

router.post('/', function(req, res){
    var i = 0;
    for (; i < rateData.length; i++) {
        if (rateData[i].UserId == req.query['user'] && rateData[i].TaskId == req.query['id'])
            break;
    }
    var input;
    if (i > rateData.length - 1) {
        input = '{"RateId":' + (rateData.length + 1) + ', ' + '"TaskId":' + req.query['id'] + ', "UserId":' + req.query['user'] + ',"Rank":' + req.query['star'] + '}';
        rateData.push(JSON.parse(input));
    }
    else {
        var convertor = JSON.stringify(rateData[i]);
        convertor = convertor.replace(convertor.substring(convertor.search('"Rank":') + '"Rank":'.length, convertor.length - 1), req.query['star']);
        rateData[i] = JSON.parse(convertor);
    }

    var writtenData = JSON.stringify(rateData);

    fs.writeFile(path.join(__dirname, 'rates.json'), writtenData, function (err2, bytes2) {
        if (err2)
            console.error(err2);
    });

    var filtered = _.where(rateData, JSON.parse('{"TaskId" : ' + req.query['id'] + "}"));
    var totalRate = 0;
    var n = 0;
    for (j = 0; j < filtered.length; j++) {
        totalRate += filtered[j].Rank;
        n++;
    }
    taskData[req.query['id'] - 1].RateAvg = totalRate / n;
    var writtenData2 = JSON.stringify(taskData);

    fs.writeFile(path.join(__dirname, 'tasks.json'), writtenData2, function (err2, bytes2) {
        if (err2)
            console.error(err2);
    });
    res.send("Ok");
});

module.exports = router;