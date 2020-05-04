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
    socket.on('make-turn', (card, relatedInfoJSON) => {
        console.log("Moving");
        try {
            move(newGame, card, currentPlayer, relatedInfoJSON, allCards);
        } catch (error) {
            console.error(error)
        }
    });


    socket.on('get mycards', (playerId) => {
        console.log("get cards");
        sendPlayerCards(newGame.findPlayerById(playerId.playerId));
    });



    function sendPlayerCards(player) {
        if (player) {
            io.to(player.socketId).emit('my cards', player.cards);
        }
    }
    /*
    * Prepare card desk, send 1 card per each player and one more who turns
    */
    function initialActions() {
        let cardDeck = deck.prepareDeck(room.maxPlayers);
        allCards = cardDeck.slice();
        newGame.players.forEach(player => {
            player.addCard(deck.drawCard(cardDeck).setPlayerId(player.id));
            if( player.id === newGame.moveOrderId)
                player.addCard(deck.drawCard(cardDeck).setPlayerId(player.id));
            sendPlayerCards(player);
        });
    }
};
