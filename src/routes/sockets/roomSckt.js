const Room = require('../../models').Room;
const rooms = require('../../db').rooms;
const Response = require('../../models').Response;
const gameSckt = require('./gameSckt');


module.exports = roomSckt = (io, socket, currentPlayer) => {

    socket.on('enter-room', (req) => {
        const roomId = req.roomId;
        const found_room = rooms.find(roomId);
        const nickName = req.nickName;
        if(!nickName)
            socket.emit("response", new Response("Wrong nickname"));
        else
            if (found_room) {
                if (!found_room.isPlayerExist(currentPlayer.id) && found_room.status !== "Playing" && nickName) {
                    found_room.addPlayer(currentPlayer);
                    currentPlayer.setName(nickName);
                    socket.emit("response", new Response("You've successfully entered to the room", 200, currentPlayer))
                }
                if (found_room.isFull() && found_room.status !== "Playing") {
                    found_room.status = "Playing";
                    gameSckt(io, socket, currentPlayer, found_room);

                }
                rooms.update(rooms.find(roomId), found_room);
            }
            else
                socket.emit("response", new Response("Wrong room id"));
    });


    socket.on('get-rooms', () => {
        sendWaitingRooms();
    });

    socket.on('get-room', (idObj) => {
        const found_room = rooms.find(idObj.id);
        if (found_room)
            socket.emit('receive-room', new Response("Done", 200, found_room));
        else
            socket.emit('receive-room', new Response());
    });


    socket.on('new-room', (req) => {
        const roomName = req.roomName;
        const maxPlayers = req.maxPlayers;
        if (roomName && maxPlayers) { 
            let createdRoom = new Room(roomName, 'Waiting', maxPlayers);
            rooms.write(createdRoom);
            socket.emit('created-room', new Response("Done", 200, createdRoom));
            sendWaitingRooms();
        }
        else
            socket.emit('created-room', new Response("Wrong arguments"));
    });

    const sendWaitingRooms = () => {
        const waitingRooms = rooms.readAll().filter(r => r.status !== "Playing");
        socket.emit('receive-rooms', new Response("Done", 200, waitingRooms))
    }
};


