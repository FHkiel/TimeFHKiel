/**
 * Created by Hai on 11/19/2016.
 */
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var objData = require(path.join(__dirname,'tasks.json'));
var disjunctionData = require(path.join(__dirname,'disjunction.json'));
var conjunctionData = require(path.join(__dirname,'conjunction.json'));
var natural = require('natural');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    var myTask = req.query['id'];
    var myData = {'myData' : myTask};
    res.render('DoneTask', myData);
});

function containKey(jsonArray, pattern){
    for(var i = 0; i < jsonArray.length; i++){
        //console.log(i + ":" + JSON.stringify(jsonArray[i]) + "-" + pattern);
        if(pattern == Object.keys(jsonArray[i]))
            return i;
    }
    return -1;
}

function DisjunctionMatrix(disjunct_Sort, sentences){
    // [{"PHP" : {"PHP" : 2, "Zend" : 3, "Java" : 4} }]
    for(var i = 0; i < sentences.length; i++){
        //console.log("sentences " + i + ":" + sentences[i]);
        for(var j = 0; j < sentences[i].length; j++) {
            var index;
            if ((index = containKey(disjunct_Sort, sentences[i][j])) > -1) {
                //console.log(index + "-" + JSON.stringify(disjunct_Sort[index]));
                for(var k = 0; k < Object.keys(disjunct_Sort[index][sentences[i][j]]).length; k++){
                    var keyCell = Object.keys(disjunct_Sort[index][sentences[i][j]])[k];
                    disjunct_Sort[index][sentences[i][j]][keyCell]++;
                    for(var h = 0; h <= j; h++) {
                        if (sentences[i][h] == keyCell) {
                            disjunct_Sort[index][sentences[i][j]][keyCell]--;
                            break;
                        }
                    }
                    //console.log(keyCell + "-" + disjunct_Sort[index][sentences[i][j]][keyCell]);
                }
                for(var k = 0; k < disjunct_Sort.length; k++){
                    var keyRow = Object.keys(disjunct_Sort[k]);
                    disjunct_Sort[k][keyRow][sentences[i][j]]++;
                    for(var h = 0; h < j; h++) {
                        if (sentences[i][h] == keyRow) {
                            disjunct_Sort[k][keyRow][sentences[i][j]]--;
                            break;
                        }
                    }
                }
                //console.log("Existing disjunct_Sort :" + JSON.stringify(disjunct_Sort));
            }
            else{
                var RowValue = {};
                var myKey = sentences[i][j];
                for(var k = 0; k < disjunct_Sort.length; k++){
                    var keyRow = Object.keys(disjunct_Sort[k]);
                    //console.log("disjunct_Sort[" + keyRow + "] - " + disjunct_Sort[k][keyRow][keyRow]);
                    RowValue[keyRow] = disjunct_Sort[k][keyRow][keyRow];
                    RowValue[keyRow]++;
                    for(var h = 0; h < j; h++) {
                        if (sentences[i][h] == keyRow) {
                            RowValue[keyRow]--;
                            break;
                        }
                    }
                    disjunct_Sort[k][keyRow][myKey] = RowValue[keyRow];
                }
                RowValue[myKey] = 1;
                //console.log("Non-existing RowValue :" + JSON.stringify(RowValue));
                disjunct_Sort.push(JSON.parse('{"' + sentences[i][j] + '":' + JSON.stringify(RowValue) + '}'));
                //console.log("Non-existing disjunct_Sort :" + JSON.stringify(disjunct_Sort));
            }
        }
    }
    return disjunct_Sort;
}

function ConjunctionMatrix(conjunct_Sort, sentences){
    // [{"PHP" : {"PHP" : 2, "Zend" : 3, "Java" : 4} }]
    for(var i = 0; i < sentences.length; i++){
        //console.log("sentences " + i + ":" + sentences[i]);
        for(var j = 0; j < sentences[i].length; j++) {
            var index;
            if ((index = containKey(conjunct_Sort, sentences[i][j])) > -1) {
                //console.log(index + "-" + JSON.stringify(conjunct_Sort[index]));
                for(var k = 0; k < Object.keys(conjunct_Sort[index][sentences[i][j]]).length; k++){
                    var keyCell = Object.keys(conjunct_Sort[index][sentences[i][j]])[k];
                    for(var h = 0; h <= j; h++) {
                        if (sentences[i][h] == keyCell) {
                            conjunct_Sort[index][sentences[i][j]][keyCell]++;
                            break;
                        }
                    }
                    //console.log(keyCell + "-" + conjunct_Sort[index][sentences[i][j]][keyCell]);
                }
                for(var k = 0; k < conjunct_Sort.length; k++){
                    var keyRow = Object.keys(conjunct_Sort[k]);
                    for(var h = 0; h < j; h++) {
                        if (sentences[i][h] == keyRow) {
                            conjunct_Sort[k][keyRow][sentences[i][j]]++;
                            break;
                        }
                    }
                }
                //console.log("Existing conjunct_Sort :" + JSON.stringify(conjunct_Sort));
            }
            else{
                var RowValue = {};
                var myKey = sentences[i][j];
                for(var k = 0; k < conjunct_Sort.length; k++){
                    var keyRow = Object.keys(conjunct_Sort[k]);
                    //console.log("conjunct_Sort[" + keyRow + "] - " + conjunct_Sort[k][keyRow][keyRow]);
                    RowValue[keyRow] = 0;
                    for(var h = 0; h <= j; h++) {
                        if (sentences[i][h] == keyRow) {
                            RowValue[keyRow]++;
                            break;
                        }
                    }
                    conjunct_Sort[k][keyRow][myKey] = RowValue[keyRow];
                }
                RowValue[myKey] = 1;
                //console.log("Non-existing RowValue :" + JSON.stringify(RowValue));
                conjunct_Sort.push(JSON.parse('{"' + sentences[i][j] + '":' + JSON.stringify(RowValue) + '}'));
                //console.log("Non-existing conjunct_Sort :" + JSON.stringify(conjunct_Sort));
            }
        }
    }
    return conjunct_Sort;
}

function LinkStrengthMatrix(X,Y) {
    var LSt_Matrix = X;
    for(var i = 0; i < LSt_Matrix.length; i++){
        var keyRow = Object.keys(LSt_Matrix[i]);
        for(var j = 0; j < Object.keys(LSt_Matrix[i][keyRow]).length; j++){
            var keyCell = Object.keys(LSt_Matrix[i][keyRow])[j];
            var denominator = Y[i][keyRow][keyCell] - X[i][keyRow][keyCell];
            if(denominator == 0)
                LSt_Matrix[i][keyRow][keyCell] = 0;
            else
                LSt_Matrix[i][keyRow][keyCell] = X[i][keyRow][keyCell] / denominator;
        }
    }
    return LSt_Matrix;
}

function calculateCorr(LStr_Mt){
    var Corr_Matrix = [];
    for(var i = 0; i < LStr_Mt.length; ++i) {
        Corr_Matrix.push(JSON.parse(JSON.stringify(LStr_Mt[i])));
    }
    for(var i = 0; i < Corr_Matrix.length; i++) {
        var keyRow = Object.keys(Corr_Matrix[i]);
        var X = LStr_Mt[i][keyRow];
        var sum_X = 0;
        for(var h = 0; h < Object.keys(X).length; h++){
            var keyCell = Object.keys(X)[h];
            sum_X += X[keyCell];
        }
        var sum_squareX = 0;
        for(var h = 0; h < Object.keys(X).length; h++){
            var keyCell = Object.keys(X)[h];
            sum_squareX += Math.pow(X[keyCell],2);
        }
        //console.log(keyRow + ":" + sum_X + "-" + sum_squareX);
        for (var j = i; j < Object.keys(Corr_Matrix[i][keyRow]).length; j++) {
            var keyCell = Object.keys(Corr_Matrix[i][keyRow])[j];
            if(keyCell == keyRow)
                Corr_Matrix[i][keyRow][keyCell] = 1;
            else{
                // find Y
                var indexY = 0;
                for(var k = LStr_Mt.length - 1; k > -1; k--){
                    if(Object.keys(Corr_Matrix[k]) == keyCell){
                        indexY = k;
                        break;
                    }
                }
                var Y = LStr_Mt[indexY][keyCell];
                //console.log(JSON.stringify(Y) + "====" + JSON.stringify(X));
                var sum_Y = 0;
                var sum_X_Y = 0;
                for(var h = 0; h < Object.keys(Y).length; h++){
                    var keyCell1 = Object.keys(Y)[h];
                    sum_Y += Y[keyCell1];
                    sum_X_Y += X[keyCell1]*Y[keyCell1];
                }
                var sum_squareY = 0;
                for(var h = 0; h < Object.keys(Y).length; h++){
                    var keyCell1 = Object.keys(Y)[h];
                    sum_squareY += Math.pow(Y[keyCell1],2);
                }
                //console.log(keyCell + ":" + sum_Y + "-" + sum_squareY + "==" + sum_X_Y + "-" + Corr_Matrix.length);
                var n = Corr_Matrix.length;
                var denominator = Math.sqrt((n*sum_squareX-Math.pow(sum_X,2)) * (n*sum_squareY-Math.pow(sum_Y,2)));
                if(denominator == 0)
                    Corr_Matrix[i][keyRow][keyCell] = 0;
                else
                    Corr_Matrix[i][keyRow][keyCell] = Math.abs(n * sum_X_Y - sum_X * sum_Y) / denominator;
                Corr_Matrix[indexY][keyCell][keyRow] = Corr_Matrix[i][keyRow][keyCell];
            }
        }
    }
    return Corr_Matrix;
}

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
        res.send("ok");
        var disjunct_Sort = disjunctionData;
        var conjunct_Sort = conjunctionData;
        natural.PorterStemmer.attach();
        var sentence1 = objData[myTask - 1].NameTask.tokenizeAndStem();
        var sentence2 = objData[myTask - 1].Exp.tokenizeAndStem();
        var sentence3 = objData[myTask - 1].NoteTask.tokenizeAndStem();
        var sentences = [];
        sentences.push(sentence1);
        sentences.push(sentence2);
        sentences.push(sentence3);
        var Y = DisjunctionMatrix(disjunct_Sort, sentences);
        var X = ConjunctionMatrix(conjunct_Sort, sentences);
        var LStr = LinkStrengthMatrix(X, Y);
        var corr = calculateCorr(LStr);
        writtenData = JSON.stringify(X);

        fs.writeFile(path.join(__dirname,'conjunction.json'), writtenData,  function(err2, bytes2)
        {
            if (err2)
                console.error(err2);
        });

        writtenData = JSON.stringify(Y);

        fs.writeFile(path.join(__dirname,'disjunction.json'), writtenData,  function(err2, bytes2)
        {
            if (err2)
                console.error(err2);
        });
        writtenData = JSON.stringify(corr);

        fs.writeFile(path.join(__dirname,'correlation.json'), writtenData,  function(err2, bytes2)
        {
            if (err2)
                console.error(err2);
        });
    }catch(ex){
        console.log(ex);
    }
});

module.exports = router;