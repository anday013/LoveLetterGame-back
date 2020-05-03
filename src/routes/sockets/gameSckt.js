module.exports = gameSckt = (io, socket, currentPlayer, room) => {
    const deck = require('../../services').deck;
    const move = require('../../services').move;
    const Game = require('../../models').Game;
    let allCards = [];
    let newGame = new Game(room);

    initialActions();


    /*
    * When player is turning
    */
    socket.on('move', (card, relatedInfoJSON) => {
        try {
            move(newGame, card, currentPlayer, relatedInfoJSON, allCards);
        } catch (error) {
            console.error(error)
        }
    });


    socket.on('get mycards', (playerName) => {
        sendPlayerCards(newGame.findPlayerByName(playerName));
    });



    function sendPlayerCards(player) {
        if (player) {
            console.log("Cards sent")
            io.to(player.socketId).emit('my cards', player.cards);
        }
    }


    function initialActions() {
        // newGame.addPlayer(currentPlayer)
        let cardDeck = deck.prepareDeck(room.maxPlayers);
        allCards = cardDeck.slice();
        newGame.players.forEach(player => {
            let drawedCard = cardDeck.drawCard().setPlayerId(player.id)
            player.addCard(drawedCard);
            sendPlayerCards(player);
        });
        io.to(newGame.moveOrderId)


    }




} 