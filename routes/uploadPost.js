/**
 * Created by moham on 11/20/2016.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var fs2 = require('fs');
var PDFParser = require("pdf2json");
var pdfParser = new PDFParser();
var theFileName ='';
var origFileName = '';
var theFileExt = '';
var timetable = [];

var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;

var converPDF2JSON = require('../controller/fhkielpdftojson');

var objdata;
var namees = "<b> Already Uploaded </b>";

router.post('/', function(req, res) {
    req.pipe(req.busboy);

    //receives the file sent by http client and saves in /Schedules folder
    req.busboy.on('file', function(fieldname, file, filename) {
        var fstream = fs.createWriteStream(path.join(__dirname + '/../Schedules/', filename));
        theFileName = filename.split(".");
        theFileExt = theFileName[theFileName.length-1];
        theFileName = theFileName[0]+".json";
        origFileName =filename;

        file.pipe(fstream);
        fstream.on('close', function () {

            res.redirect('back');
        });

        // setting properties for parsing the downloaded pdf file into JSON file using Github project "pdf2json"
        pdfParser.on("pdfParser_dataReady", function (pdfData) {
            fs2.writeFile(path.join(__dirname + '/../Schedules/', theFileName), JSON.stringify(pdfData));
            console.log("this was compiled");
        });
        pdfParser.loadPDF(path.join(__dirname + '/../Schedules/', origFileName));

        //timer is not a good idea to over come the Async issues
        // "pdf2json" project is not mature enough to accurately parse pdf files, there for
        // toJSONRefin method is used to remove duplicate JSON elements
        setTimeout(toJSONRefine, 5000);

        //if(timetable.length > 4)
        setTimeout(insertToDB, 7000);

        //   insertToDB(function (err) {
        //     console.log(err + " error occured");
        //         toJSONRefine(function(){
        //
        //          });

        // });
    });
});

function toJSONRefine(){
    //the parsed JSON data is save in "theFileName"
    objdata = require(path.join(__dirname + '/../Schedules/', theFileName));

    //timetable is an array that get the return data by convrtPDF2JSON,
    // the function is the main method that read json data line by line, analyses and extracts classes timetable
    timetable = converPDF2JSON(objdata);
    console.log("json to refine");
    //fs3.writeFile('./Schedules/converted/'+ theFileName,JSON.stringify(timetable, null, 2) , 'utf-8');
}

function insertToDB(){

    mongoose.createConnection('mongodb://localhost/calendar');

    var db = mongoose.connection;

    db.on('error', function (err) {
        console.log('connection error', err);
    });
    db.once('open', function () {
        console.log('connected.');
    });


    var KlassModel;
    if(KlassModel) {
        KlassModel =  mongoose.model('fhcalendars');
    }else{
        KlassModel =  mongoose.model('fhcalendars');
    }

    for (var temp=0; temp < timetable.length; temp++) {
        console.log(timetable[temp]);
        var klass = new KlassModel(timetable[temp]);
        klass.save(function (err, data) {
            if (err) {
                console.log(err)
            }
            else {


            }
        });
    }


}

module.exports = router