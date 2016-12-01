/**
 * Created by moham on 11/20/2016.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var fs2 = require('fs');
var fs3 = require('fs');
var PDFParser = require("pdf2json");
var pdfParser = new PDFParser();
var theFileName ='';
var origFileName = '';
var theFileExt = '';
var timetable = [];
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var converPDF2JSON = require('../controller/fhkielpdftojson');
//var objdata = require(path.join(__dirname, '../Schedules/Master_MIE_C.json'));
var objdata;
var namees = "<b> Already Uploaded </b>";
/* GET home page. */

router.post('/', function(req, res) {
        req.pipe(req.busboy);

        req.busboy.on('file', function(fieldname, file, filename) {
                var fstream = fs.createWriteStream('./Schedules/' + filename);
                theFileName = filename.split(".");
                theFileExt = theFileName[theFileName.length-1];
                theFileName = theFileName[0]+".json";
                origFileName =filename;

                file.pipe(fstream);
                fstream.on('close', function () {

                        res.redirect('back');
                });
                if(theFileExt.indexOf('pdf') != -1) {
                        pdfParser.on("pdfParser_dataReady", function (pdfData) {
                                fs2.writeFile('./Schedules/'+theFileName, JSON.stringify(pdfData));
                        });
                        pdfParser.loadPDF('./Schedules/'+ origFileName);

                        setTimeout(toJSONRefine, 6000);

                       // if(timetable.length > 4)
                        setTimeout(insertToDB, 18000);

                }

        });



});

function toJSONRefine(){
        objdata = require(path.join(__dirname + '/../Schedules/', theFileName));
        timetable = converPDF2JSON(objdata);
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


        var Schema = mongoose.Schema;
        var klassSchema = new Schema({


                "start": String,
                "end": String,
                "title": String,
                "detail": String
        });
        var klassMod = mongoose.model('fhcalendars', klassSchema);
        var klass2 = new klassMod({

                "start": "08:15",
                "end": "11:30",
                "title": "MI121-Lab Auditory_Analysis and_Audio_Coding ",
                "detail": "Mo Dr. Taghipour C12-2.69 "
        });

        for (var temp=0; temp < timetable.length; temp++) {
                var klass = new klassMod(timetable[temp]);
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