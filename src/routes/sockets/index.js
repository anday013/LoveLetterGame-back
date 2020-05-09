

let sockets = {};
sockets.init = (server) => {
    let io = require('socket.io').listen(server);
    let crypto = require("crypto");
    let connections = [];
    const roomSckt = require('./roomSckt');
    const Player = require('../../models').Player;
    io.on("connection", function (socket) {


        connections.push(socket);
    
        let currentPlayer = new Player('player' + crypto.randomBytes(16).toString("hex"), 0, socket.id);
        //Connected
        console.log("Connected: current number of players is %s", connections.length);

        //Game part
        roomSckt(io, socket, currentPlayer);
        //Disconnected
        socket.on("disconnect", function (data) {
            connections.splice(connections.indexOf(socket), 1);
            console.log("Disconnected: current number of players is %s", connections.length);
        });
        
        io.of('/rooms').on('connection', (socket) => {
            console.log(socket.id)
        })
        
    });
    
}


module.exports = sockets;