/**
 * Created by moham on 12/1/2016.
 */
/**
 * Created by moham on 11/20/2016.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/calendar');
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
    "title": String,
    "detail": String
});
var klassMod  = mongoose.model('fhcalendars');


var Person = klassMod;
/* GET home page. */
router.get('/getClassesByName', function(req, res, next) {
    console.log(req.query.title);
    Person.find({'title':unescape(req.query.title)}, function (err, docs) {
        if (!err) {
            res.send(docs);

        } else {
            throw err;
        }
    }).select({"start":1, "end": 1, "title": 1,"detail":1, "_id": 0});

});

module.exports = router;
