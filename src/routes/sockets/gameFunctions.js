const deck = require('../../services').deck;
const move = require('../../services').move;
const Game = require('../../models').Game;
const Response = require('../../models').Response;
const initializeGame = (io, room) => {
    let newGame = new Game(room);
    initialActions(newGame, io);  
    return newGame;
};

/*
* Prepare card desk, send 1 card per each player and one more who turns
*/ 
function initialActions(game, io) {
    let cardDeck = deck.prepareDeck(game.room.maxPlayers);
    game.allCards = cardDeck.slice();
    
    if(game.room.maxPlayers == 2) 
         twoPlayerMod(cardDeck);
   

    game.players.forEach(player => {
        player.addCard(deck.drawCard(cardDeck).setPlayerId(player.id));
        if( player.id === game.moveOrderId)
            player.addCard(deck.drawCard(cardDeck).setPlayerId(player.id));
        sendPlayerCards(player, io);
    });
}

function twoPlayerMod(cardDeck){
    for (let i = 0; i < 3; i++) 
        deck.drawCard(cardDeck)
}


function sendPlayerCards(player, io) {
    if (player) 
        io.to(player.socketId).emit('my-cards', new Response("Your cards...", 200, player.cards));
}
module.exports = {initializeGame, sendPlayerCards}