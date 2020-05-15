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
            let currentGame = findGame(card);
            if (!currentGame)
                return;
            let cardResponse = {};
            let playedCard = new Response("Played card", 200, { fromPlayer: currentPlayer.id, cardPower: card.power, toPlayer: relatedInfo.targetPlayerId});
            const moveResult = move(currentGame, card, currentGame.findPlayerById(currentPlayer.id), relatedInfo, cardResponse);
            let moveResponse;
            switch (moveResult) {
                case "Success":
                    moveResponse = new Response(moveResult, 200);
                    let winner;
                    if ((winner = gameFunctions.checkForWinner(currentGame))) {
                        io.to(currentGame.room.name).emit('win', new Response("Win", 200, winner));
                        gameFunctions.sendPlayersWithoutCards(currentGame.activePlayers, io, currentGame);
                        currentGame = gameFunctions.newRound(currentGame, io);
                        io.to(currentGame.room.name).emit("update-room", new Response("", 200, currentGame.room.players));
                        return;
                    }

                    gameFunctions.nextStep(currentGame, currentGame.cardDeck, io);
                    break;
                case "It's not your turn":
                    moveResponse = new Response(moveResult);
                    playedCard.status = 404;
                    break;
                case "Protected":
                    moveResponse = new Response(moveResult, 300);
                    playedCard.status = 300;
                    break;
                case "Wrong card played":
                    moveResponse = new Response(moveResult, 500);
                    playedCard.status = 500;
                    break;
                case "All players protected but you have self playable card":
                    moveResponse = new Response(moveResult, 309);
                    playedCard.status = 309;
                    break;
                case "All players protected":
                    moveResponse = new Response(moveResult, 303);
                    playedCard.status = 303;
                    gameFunctions.nextStep(currentGame, currentGame.cardDeck, io);
                    break;
            }
            io.to(currentGame.room.name).emit('played-card', playedCard);
            io.to(currentPlayer.socketId).emit('turn-result', moveResponse);
            if (card.power === 2)
                io.to(currentPlayer.socketId).emit('card-priest', new Response("card-priest", 200, { targetPlayerId: relatedInfo.targetPlayerId, cardResponseResult: cardResponse.result }));
            gameFunctions.sendPlayersWithoutCards(currentGame.activePlayers, io, currentGame)
            // io.to(currentGame.room.name).emit('player-lost', new Response("Lost",200, playerObj))
            // io.to(currentGame.room.name).emit('active-players', new Response("Active players",200, currentGame.activePlayers)) +
            // io.to(currentPlayer.socketId).emit('card-priest', new Response("Card priest",200, {targetPlayer.id ,targetPlayer.cards})); +
            // io.to(currentGame.room.name).emit('card-prince', new Response("Card prince",200, targetPlayer.id)); +
            // io.to(currentGame.room.name).emit('card-king', new Response("Card king",200, {currentPlayer.id ,targetPlayer.id})); +
        }
        catch (error) {
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


