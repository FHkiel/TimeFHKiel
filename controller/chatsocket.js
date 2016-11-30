/**
 * Created by moham on 11/30/2016.
 */

module.exports = function (io) {
    var nicknames = [];
    var fs = require('fs');
    io.on('connection', function (socket) {
        socket.on('new user', function (muser, callback) {
            if (nicknames.indexOf(muser) != -1) {
                callback(false);
            } else {
                callback(true);
                socket.nickname = muser;
                nicknames.push(socket.nickname);
                //calls updateNicknames() function to update the list of logged in users
                updateNicknames();
            }
        });

        //Updates the list of logged in users
        function updateNicknames() {
            io.sockets.emit('usernames', nicknames);
        }

        //disconnects the connection and removes the user name from the array list by index.

        socket.on('disconnect', function (users) {

            if (!socket.nickname) return;
            nicknames.splice(nicknames.indexOf(socket.nickname), 1);
            updateNicknames();
        });

        //receives the chat message of the user and appends to json file.
        socket.on('chat message', function (msg) {
            var pack = {"message": msg, "name": socket.nickname};
            io.emit('chat message', pack);
            var smsg;
            if (msg == "") {
                msg = "User Login";
            }
            data = {"message": msg, "nick": socket.nickname};
            fs.appendFile('data.json', JSON.stringify(data));
        });
    });
}