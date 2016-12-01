/**
 * Created by Hai on 11/19/2016.
 */
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var objData = require(path.join(__dirname,'tasks.json'));
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
    var myTask;
    myTask = req.query['id'];
    var myData = {'myId': myTask, 'myData' : objData[myTask-1], 'Pri1': '','Pri2': '','Pri3': '','Pri4': ''};
    switch(objData[myTask-1].priorityTask){
        case '1':
            myData.Pri1 = 'checked';
            break;
        case '2':
            myData.Pri2 = 'checked';
            break;
        case '3':
            myData.Pri3 = 'checked';
            break;
        case '4':
            myData.Pri4 = 'checked';
            break;
    }
    res.render('ModifyTask', myData);
});

var add_2_DB = function(){
    var writtenData;
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
        if (prio === undefined || prio == "undefined")
            prio = "4";
        var myTask = req.body['id'];
        objData[myTask - 1].NameTask = req.body['NameTask'];
        objData[myTask - 1].startTime = req.body['STime'];
        objData[myTask - 1].startDate = req.body['SDate'];
        objData[myTask - 1].priorityTask = prio;
        objData[myTask - 1].NoteTask = req.body['NoteTask'];
        objData[myTask - 1].PostponeTime = req.body['FTime'];
        objData[myTask - 1].PostponeDate = req.body['FDate'];
        add_2_DB();
    }catch(ex){
        console.log(ex);
    }

    res.send("Ok");
});

module.exports = router;