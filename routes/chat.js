
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var data;
var fs = require('fs');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('chat', { title: 'Express' });
});

nicknames = [];

//established connection and saves the user name in the nicknames array.
//username is passed in the parameter and then saved.

io.on('connection', function(socket){
    socket.on('new user', function (muser, callback){
        if (nicknames.indexOf(muser) !=-1){
            callback(false);
        } else{
            callback (true);
            socket.nickname = muser;
            nicknames.push(socket.nickname);
            //calls updateNicknames() function to update the list of logged in users
            updateNicknames();
        }
    });

    //Updates the list of logged in users
    function updateNicknames(){
        io.sockets.emit('usernames', nicknames);
    }

    //disconnects the connection and removes the user name from the array list by index.

    socket.on('disconnect', function(users){

        if(!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        updateNicknames();
    });

    //receives the chat message of the user and appends to json file.
    socket.on('chat message', function(msg){
        var pack = {"message":msg, "name":socket.nickname};
        io.emit('chat message', pack);
        var smsg;
        if(msg == "") {
            msg = "User Login";
        }
        data ={"message":msg,"nick":socket.nickname};
        fs.appendFile('data.json', JSON.stringify(data));
    });
});


module.exports = router;
