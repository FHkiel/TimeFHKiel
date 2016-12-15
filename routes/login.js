
var express = require('express');
var router = express.Router();

var app = require('express')();

var data;
var fs = require('fs');

var isAuthenticated=require('../middleware/authentication');
module.exports = function(passport){

    /* GET login page. */
    router.get('/', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('login', { message: req.flash('message') });
    });

    router.get('/login', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('login', { message: req.flash('message') });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash : true
    }));


    router.get('/signup', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('signup', { message: req.flash('message') });
    });

    /* Handle Registration POST */
    router.post('/signup',passport.authenticate('signup',{
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash : true
    }));



    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}




