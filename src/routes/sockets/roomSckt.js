
const Room = require('../../models').Room;
const rooms = require('../../db').rooms;
const Response = require('../../models').Response;


module.exports = roomSckt = (io, socket, currentPlayer) =>{
    socket.on('enter-room', (roomId) => {
        const found_room = rooms.find(roomId);
        if (found_room){
            socket.join(found_room.name);
            found_room.addPlayer(currentPlayer)
            rooms.update(rooms.find(id), found_room);
        }
    })


    socket.on('get-rooms',  () => {
        socket.emit('receive-rooms', new Response("Done", 200 , rooms.readAll()))
    });

    socket.on('get-room',  (id) => {
        const found_room = rooms.find(id);
        if (found_room) {
            socket.emit('receive-room',new Response("Done", 200 , found_room));
        }
        else
            socket.emit('receive-room',new Response());
    });


    socket.on('new-room', (roomName, maxPlayers) => {
        if (roomName && maxPlayers) {
            let createdRoom = new Room(roomName, max_players, 'Wait');
            rooms.write(createdRoom);
            socket.emit('created-room',new Response("Done", 200 , found_room));
        }
        else
            socket.emit('created-room',new Response("Wrong arguments"));
    });
} 