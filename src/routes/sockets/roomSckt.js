const Room = require('../../models').Room;
const rooms = require('../../db').rooms;
const Response = require('../../models').Response;
const gameSckt = require('./gameSckt');


module.exports = roomSckt = (io, socket, currentPlayer) => {
    socket.on('enter-room', (req) => {
        const roomId = req.roomId;
        const found_room = rooms.find(roomId);
        const nickName = req.nickName;
        if (found_room) {
            if (!found_room.isPlayerExist(currentPlayer.id) && found_room.status !== "Playing" && nickName) {
                found_room.addPlayer(currentPlayer);
                socket.emit("response", new Response("You've successfully entered to the room", 200, currentPlayer))
            }
            if (found_room.isFull() && found_room.status !== "Playing") {
                found_room.status = "Playing";
                console.log("Game started")
                gameSckt(io, socket, currentPlayer, found_room);

            }
            rooms.update(rooms.find(roomId), found_room);
        }
    })


    socket.on('get-rooms', () => {
        const waitingRooms = rooms.readAll().filter(r => r.status !== "Playing");
        socket.emit('receive-rooms', new Response("Done", 200, waitingRooms))
    });

    socket.on('get-room', (id) => {
        const found_room = rooms.find(id);
        if (found_room)
            socket.emit('receive-room', new Response("Done", 200, found_room));
        else
            socket.emit('receive-room', new Response());
    });


    socket.on('new-room', (req) => {
        const roomName = req.roomName;
        const maxPlayers = req.maxPlayers;
        const nickName = req.nickName;
        if (roomName && maxPlayers && nickName) {
            let createdRoom = new Room(roomName, 'Waiting', maxPlayers);
            createdRoom.addPlayer(currentPlayer);
            rooms.write(createdRoom);
            currentPlayer.setName(nickName);
            socket.emit('created-room', new Response("Done", 200, { createdRoom, currentPlayer }));
        }
        else
            socket.emit('created-room', new Response("Wrong arguments"));
    });
} 