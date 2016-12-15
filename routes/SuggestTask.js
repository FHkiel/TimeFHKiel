/**
 * Created by Hai on 11/19/2016.
 */
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var objData = require(path.join(__dirname,'tasks.json'));
var natural = require('natural');
var _ = require('underscore');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    var myTask = req.query['id'];
    var myName = req.query['name'];
    var filtered = _.where(objData, {Shared: "True"});
    natural.PorterStemmer.attach();
    // stem and split name
    var Results = [];
    var Score = [];
    myName = "i am waking up to the sounds of chainsaws";
    var keyTerms = myName.tokenizeAndStem();
    //console.log(keyTerms);
    for(var i = 0; i < filtered.length; i++){
        // TODO measure distance for conditions (>0.7)
        if(filtered[i].TaskId !== myTask && (filtered[i].NameTask.includes(myName) || filtered[i].NoteTask.includes(myName) || filtered[i].Exp.includes(myName))){
            // TODO Sum score
            Results.push(filtered[i]);
            // Score.push();
        }
    }
    // TODO sort by the score of matching, rate
    var myData = {'myData' : myTask};
    res.render('DoneTask', myData);
});

module.exports = router;