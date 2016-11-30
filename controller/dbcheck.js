var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/calendar');
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('connected.');
});

var Schema = mongoose.Schema;
var klassSchema = new Schema({

    "date": String,
    "sTime": String,
     "eTime": String,
     "name": String,
    "detail": String
});



var klassMod = mongoose.model('fhcalendars', klassSchema);

var klass = new klassMod({
    "date": "2016-12-199",
    "sTime": "02528:15",
    "eTime": "11:30",
    "name": "MI121-Lab Auditory_Analysis and_Audio_Coding ",
    "detail": "Mo Dr. Taghipour C12-2.69 "
});

klass.save(function (err, data) {
    if (err){console.log(err.message)}
    else console.log('Saved ', data);
});

