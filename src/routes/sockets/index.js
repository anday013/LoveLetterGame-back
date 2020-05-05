

let sockets = {};
sockets.init = (server) => {
    let io = require('socket.io').listen(server);
    let crypto = require("crypto");
    let connections = [];
    const gameSckt = require('./gameSckt');
    const roomSckt = require('./roomSckt');
    const Player = require('../../models').Player;
    io.on("connection", function (socket) {


        connections.push(socket);
        console.log("Current user socket id: " + socket.id)
    
        let currentPlayer = new Player('player' + crypto.randomBytes(16).toString("hex"), 0, socket.id);
        //Connected
        console.log("Connected: current number of players is %s", connections.length);

        //Game part
        // gameSckt(io, socket, currentPlayer);
        roomSckt(io, socket, currentPlayer);
        //Disconnected
        socket.on("disconnect", function (data) {
            connections.splice(connections.indexOf(socket), 1);
            console.log("Disconnected: current number of players is %s", connections.length);
        });


    });
}


module.exports = sockets;