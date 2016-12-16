/**
 * Created by Hai on 11/19/2016.
 */
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var objData = require(path.join(__dirname,'tasks.json'));
var fs = require('fs');
var _ = require('underscore');

var myId = 2;

/* GET home page. */
router.get('/', function(req, res, next) {
    var filtered = _.where(objData, {Owner: myId});
    res.render('ShowTask', {'myData' : filtered});
});

router.post('/', function(req, res){
    var myTask = req.query['id'];
    objData[myTask - 1].Status = "Delete";
    var currentdate = new Date();
    objData[myTask - 1].finishTime = currentdate.getHours() + ':' + currentdate.getMinutes();
    objData[myTask - 1].finishDate = currentdate.getFullYear() + '-' + (currentdate.getMonth()+1) + '-' + currentdate.getDate();

    var writtenData;
    writtenData = JSON.stringify(objData);

    fs.writeFile(path.join(__dirname,'tasks.json'), writtenData,  function(err2, bytes2)
    {
        //if (err2)
          //  console.error(err2);
    });
    res.send("Ok");
});

module.exports = router;