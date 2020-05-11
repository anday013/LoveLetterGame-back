const Room = require('../../models').Room;
const rooms = require('../../db').rooms;
const Response = require('../../models').Response;
const gameFunctions = require('./gameFunctions')
const move = require('../../services').move;
const games = [];

module.exports = roomSckt = (io, socket, currentPlayer) => {
    socket.on('enter-room', async (req) => {
        const roomId = req.roomId;
        const found_room = await rooms.find(roomId);
        const nickName = req.nickName;
        if (!nickName)
            socket.emit("room-response", new Response("Wrong nickname"));
        else
            if (found_room) {
                socket.join(found_room.name);
                roomPlayerCheck(found_room, nickName);
                startGameFlag(found_room);
                await rooms.update(await rooms.find(roomId), found_room);
                await sendWaitingRooms();
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
            if (moveResult === "Success") {
                moveResponse = new Response(moveResult, 200, {});
                if ((winner = gameFunctions.checkForWinner(currentGame))) {
                    io.to(currentGame.room.name).emit('win', new Response("Win", 200, winner))
                    return;
                }

                if (!gameFunctions.nextStep(currentGame, currentGame.cardDeck, io))
                    currentGame = gameFunctions.newRound(currentGame, io);
            }
            else if (moveResult === "It's not your turn")
                moveResponse = new Response(moveResult);
            io.to(currentPlayer.socketId).emit('turn-result', moveResponse);
            // io.to(currentGame.room.name).emit('player-lost', new Response("Lost",200, playerObj))
            // io.to(currentGame.room.name).emit('active-players', new Response("Active players",200, currentGame.activePlayers))
            // io.to(currentPlayer.socketId).emit('card-priest', new Response("Card priest",200, {targetPlayer.id ,targetPlayer.cards}));
            // io.to(currentGame.room.name).emit('card-prince', new Response("Card prince",200, targetPlayer.id));
            // io.to(currentGame.room.name).emit('card-king', new Response("Card king",200, {currentPlayer.id ,targetPlayer.id}));
        } catch (error) {
            console.error(error)
        }
    });


    // socket.on('get-mycards', (playerId) => {
    //     gameFunctions.sendPlayerCards(newGame.findPlayerById(playerId.playerId), io);
    // });



    function findGame(card) {
        let foundGame;
        games.forEach(g => {
            if (g.allCards.find(c => c.id === card.id)) {
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


    socket.on('new-room', async (req) => {
        const roomName = req.roomName;
        const maxPlayers = req.maxPlayers;
        if (roomName && maxPlayers && isNumber(maxPlayers)) {
            let createdRoom = new Room(roomName, 'Waiting', maxPlayers);
            await rooms.write(createdRoom);
            socket.emit('created-room', new Response("Done", 200, createdRoom));
            await sendWaitingRooms();
        }
        else
            socket.emit('created-room', new Response("Wrong arguments"));
    });

    const sendWaitingRooms = async () => {
        const allRooms = await rooms.readAll();
        const waitingRooms = allRooms.filter(r => r.status !== "Playing");
        io.emit('receive-rooms', new Response("Done", 200, waitingRooms))
    }




};


