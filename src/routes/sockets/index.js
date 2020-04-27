let sockets = {};
sockets.init = (server) => {
    let io = require('socket.io').listen(server);
    let connections = [];
    const gameSckt = require('./gameSckt');
    io.on("connection", function (socket) {


        connections.push(socket);
        //Connected
        console.log("Connected: current number of players is %s", connections.length);

        //Game part
        gameSckt(io, socket);

        //Disconnected
        socket.on("disconnect", function (data) {
            connections.splice(connections.indexOf(socket), 1);
            console.log("Disconnected: current number of players is %s", connections.length);
        });


    });
}


module.exports = sockets;