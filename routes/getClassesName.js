/**
 * Created by moham on 12/1/2016.
 */
/**
 * Created by moham on 11/20/2016.
 */
var express = require('express');
var router = express.Router();

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
/* GET home page. */
router.get('/', function(req, res, next) {

    Person.distinct('title', function (err, docs) {
        if (!err) {
            res.send(docs);
        } else {
            throw err;
        }
    });




});

module.exports = router;
