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
    var myTask = req.query['id'];
    var myData = {'myData' : myTask};
    res.render('DoneTask', myData);
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
        var myTask = req.body['id'];
        objData[myTask - 1].Exp = req.body['exp'];
        objData[myTask - 1].Shared = req.body['shared'];
        objData[myTask - 1].Status = "Done";
        add_2_DB();
    }catch(ex){
        console.log(ex);
    }

    res.send("Ok");
});

module.exports = router;