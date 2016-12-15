/**
 * Created by Hai on 11/19/2016.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var objData = require(path.join(__dirname,'tasks.json'));
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {

});

var add_2_DB = function(input){
    var writtenData;
    var NoJData = objData.length;
    input = '{ "TaskId":' + (NoJData + 1) + ', ' + input;
    objData.push(JSON.parse(input));
    writtenData = JSON.stringify(objData);

    fs.writeFile(path.join(__dirname,'tasks.json'), writtenData,  function(err2, bytes2)
    {
        if (err2)
            console.error(err2);
    });
}

router.post('/', function(req, res){
    try {
        var prio = req.body['priority'];
        if (prio === undefined)
            prio = 4;
        var myId = req.body['id'];
        response = ' "Owner":' + myId + ', "NameTask":"' + req.body['NameTask'] + '","startTime":"' + req.body['STime'] + '","startDate":"' + req.body['SDate'] + '","finishTime":"' + req.body['FTime'] + '","finishDate":"' + req.body['FDate'] + '","priorityTask":"' + prio + '","NoteTask":"' + req.body['NoteTask'] + '","Status":"NotYet","RateAvg":0,"CmtNo":0,"PostponeTime":"' + req.body['FTime'] + '","PostponeDate":"' + req.body['FDate'] + '","Exp":"","Shared":"False"}';
        add_2_DB(response);
    }catch(ex){
        console.log(ex);
    }
    res.json({'taskId' : objData.length});
});

module.exports = router;