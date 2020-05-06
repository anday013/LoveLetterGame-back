module.exports = gameSckt = (io, socket, currentPlayer, room) => {
    const deck = require('../../services').deck;
    const move = require('../../services').move;
    const Game = require('../../models').Game;
    const Response = require('../../models').Response;
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
            io.to(player.socketId).emit('my-cards', new Response("Your cards...", 200, player.cards));
        }
    }
    /*
    * Prepare card desk, send 1 card per each player and one more who turns
    */
    function initialActions() {
        let cardDeck = deck.prepareDeck(room.maxPlayers);
        allCards = cardDeck.slice();
        
        if(room.maxPlayers == 2) 
             twoPlayerMod(cardDeck);
       

        newGame.players.forEach(player => {
            player.addCard(deck.drawCard(cardDeck).setPlayerId(player.id));
            if( player.id === newGame.moveOrderId)
                player.addCard(deck.drawCard(cardDeck).setPlayerId(player.id));
            sendPlayerCards(player);
        });
    }

    function twoPlayerMod(cardDeck){
        for (let i = 0; i < 3; i++) 
            deck.drawCard(cardDeck)
    }
};
