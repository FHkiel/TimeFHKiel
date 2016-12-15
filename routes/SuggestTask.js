/**
 * Created by Hai on 11/19/2016.
 */
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var objData = require(path.join(__dirname,'tasks.json'));
var correlationData = require(path.join(__dirname,'correlation.json'));
var commentData = require(path.join(__dirname,'comments.json'));
var natural = require('natural');
var _ = require('underscore');
var fs = require('fs');

function insertionSort(score, terms) {
    for (var i = 0; i < score.length; i++){
        var value = score[i];
        var tmp_term = terms[i];
        for (var j = i-1; j > -1; j--) {
            if(score[j] < value || (score[j] == value && terms[j].RateAvg < tmp_term.RateAvg))
                break;
            score[j+1] = score[j];
            terms[j+1] = terms[j];
        }
        score[j+1] = value;
        terms[j+1] = tmp_term;
    }
    return terms;
}

function getCorrelationScore(term1, term2){
    for(var i = 0; i < correlationData.length; i++){
        if(Object.keys(correlationData[i]) == term1){
            return correlationData[i][term1][term2];
        }
    }
    return 0;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    try {
        var user = 2;
        var myTask = req.query['id'];
        var myName = req.query['name'];
        var filtered = _.where(objData, {Shared: "True"});
        natural.PorterStemmer.attach();
        // stem and split name
        var Results = [];
        var my_Total_score = [];
        var lamda = 1.5;
        //myName = "i am waking up to the sounds of good morning";
        var keyTerms = myName.tokenizeAndStem();
        //console.log("keyTerms: " + keyTerms);
        var limit_Exp_distribution = 4;
        var Sum_Exp_Distribution = lamda*lamda*Math.exp(lamda*limit_Exp_distribution)-lamda*lamda*Math.exp(0);
        for (var i = 0; i < filtered.length; i++) {
            // measure distance for conditions (>0.7)
            var meanDistanceScore = 0;
            var meanCorrelationCoefficiency = 0;
            var individualDistanceScores = [];
            var individualCorrelationScores = [];
            var Keywords_of_Task = filtered[i].NameTask.tokenizeAndStem();
            Keywords_of_Task = Keywords_of_Task.concat(filtered[i].NoteTask.tokenizeAndStem());
            Keywords_of_Task = Keywords_of_Task.concat(filtered[i].Exp.tokenizeAndStem());
            //console.log("Keywords_of_Task: " + Keywords_of_Task);
            for (var j = 0; j < keyTerms.length; j++) {
                // get maximum score in term of each keyTerms
                var tmp_individualDistanceScores = [];
                for (var k = 0; k < Keywords_of_Task.length; k++) {
                    //console.log(keyTerms[j] + "-" + Keywords_of_Task[k] + " " + natural.JaroWinklerDistance(keyTerms[j], Keywords_of_Task[k]));
                    var scaled_raw_distance = limit_Exp_distribution*natural.JaroWinklerDistance(keyTerms[j], Keywords_of_Task[k]);
                    var Prob_Exp_distribution = lamda*Math.exp(lamda*scaled_raw_distance) / Sum_Exp_Distribution;
                    tmp_individualDistanceScores.push(Prob_Exp_distribution);
                    var myCorr = getCorrelationScore(keyTerms[j], Keywords_of_Task[k]);
                    individualCorrelationScores.push(myCorr);
                }
                individualDistanceScores.push(Math.max(...tmp_individualDistanceScores));
            }
            //console.log("individualDistanceScores: " + individualDistanceScores);
            // Calculate arithmetic mean of distance score
            var total = 0;
            for (var j = 0; j < individualDistanceScores.length; j++) {
                total += individualDistanceScores[j];
            }
            meanDistanceScore = total / individualDistanceScores.length;
            // Calculate harmonic mean of correlation score
            var newTotal = 0;
            for (var j = 0; j < individualCorrelationScores.length; j++) {
                newTotal += individualCorrelationScores[j];
            }
            meanCorrelationCoefficiency = newTotal / individualCorrelationScores.length;
            //console.log("meanDistanceScore: " + meanDistanceScore);
            //console.log("meanCorrelationCoefficiency: " + meanCorrelationCoefficiency);
            if(filtered[i].TaskId !== myTask && meanDistanceScore > 0.15){
                // total score = distance score * 0.7 + correlation coefficiency * 0.3
                my_Total_score.push(meanDistanceScore * 0.7 + meanCorrelationCoefficiency * 0.3);
                Results.push(filtered[i]);
            }
        }
        //console.log("my_Total_score: " + my_Total_score);
        //console.log("Results: " + Results);
        // sort by the score of matching, rate
        Results = insertionSort(my_Total_score, Results);
        //console.log("Results: " + JSON.stringify(Results));
        var filteredComments = [];
        for (var i in Results) {
            var myChunk = [];
            for (var j in commentData) {
                if (Results[i].TaskId == commentData[j].TaskId) {
                    myChunk.push(commentData[j]);
                }
            }
            filteredComments.push(myChunk);
        }
        res.json({'mySuggestion' : Results, 'myComments' : filteredComments, 'user' : user});
    }catch(ex){
        console.log(ex);
    }
});

module.exports = router;