/**
 * Created by moham on 11/20/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('uploadpdf', { title: 'Express' });
});

module.exports = router;
