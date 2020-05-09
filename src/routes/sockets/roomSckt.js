const Room = require('../../models').Room;
const rooms = require('../../db').rooms;
const Response = require('../../models').Response;
const gameFunctions = require('./gameFunctions')
const move = require('../../services').move;
const games = [];

module.exports = roomSckt = (io, socket, currentPlayer) => {
    socket.on('enter-room', (req) => {
        const roomId = req.roomId;
        const found_room = rooms.find(roomId);
        const nickName = req.nickName;
        if (!nickName)
            socket.emit("room-response", new Response("Wrong nickname"));
        else
            if (found_room) {
                socket.join(found_room.name);
                roomPlayerCheck(found_room, nickName);
                startGameFlag(found_room);
                rooms.update(rooms.find(roomId), found_room);
            }
            else
                socket.emit("room-response", new Response("Wrong room id"));
    });

    const startGameFlag = room => {
        if (room.isFull() && room.status !== "Playing") {
            room.status = "Playing";
            games.push(gameFunctions.initializeGame(io, room));
        }
    };
    const roomPlayerCheck = (room, nickName) => {
        if (!room.isPlayerExist(currentPlayer.id) && room.status !== "Playing" && nickName) {
            room.addPlayer(currentPlayer);
            currentPlayer.setName(nickName);
            socket.emit("room-response", new Response("You've successfully entered to the room", 200, currentPlayer))
            io.to(room.name).emit("update-room", new Response("", 200, room.players))
        }
    }

    socket.on('get-rooms', () => {
        sendWaitingRooms();
    });





    socket.on('make-turn', (card, relatedInfo) => {
        try {
            const currentGame = findGame(card);
            const moveResult = move(currentGame, card, currentPlayer, relatedInfo);
            let moveResponse;
            if(moveResult === "Success"){
                moveResponse = new Response(moveResult, 200, {});
                gameFunctions.nextStep(currentGame, currentGame.cardDeck, io);
            }
            else if(moveResult === "It's not your turn")
                moveResponse = new Response(moveResult);
            io.to(currentPlayer.socketId).emit('turn-result', moveResponse);
        } catch (error) {
            console.error(error)
        }
    });


    // socket.on('get-mycards', (playerId) => {
    //     gameFunctions.sendPlayerCards(newGame.findPlayerById(playerId.playerId), io);
    // });



    function findGame(card){
        let foundGame;
        games.forEach(g => {
            if(g.allCards.find(c => c.id === card.id)){
                foundGame = g;
            }
        });
        return foundGame;
    }
















    function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

    // socket.on('get-room', (idObj) => {
    //     const found_room = rooms.find(idObj.id);
    //     if (found_room)
    //         socket.emit('receive-room', new Response("Done", 200, found_room));
    //     else
    //         socket.emit('receive-room', new Response());
    // });


    socket.on('new-room', (req) => {
        const roomName = req.roomName;
        const maxPlayers = req.maxPlayers;
        if (roomName && maxPlayers && isNumber(maxPlayers)) {
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


