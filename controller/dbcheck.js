


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
    "start": String,
    "end": String,
    "name": String,
    "detail": String
});
var klassMod = mongoose.model('fhcalendars', klassSchema);

var Person = klassMod;
    Person.distinct('name', function (err, docs) {
        if (!err) {
            res.send('docs');

            db.close();
        } else {
            throw err;
        }
    });


