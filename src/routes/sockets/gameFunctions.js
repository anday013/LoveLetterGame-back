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
    game.cardDeck = deck.prepareDeck(game.room.maxPlayers);
    game.allCards = game.cardDeck.slice();

    if (game.room.maxPlayers == 2)
        twoPlayerMod(game.cardDeck);


    game.players.forEach(player => {
        drawCardForPlayer(player, game.cardDeck);
    });
    nextStep(game, game.cardDeck, io);
}

function twoPlayerMod(cardDeck) {
    for (let i = 0; i < 3; i++)
        deck.drawCardFromDeck(cardDeck)
}

function drawCardForPlayer(player, cardDeck) {
    player.addCard(deck.drawCardFromDeck(cardDeck).setPlayerId(player.id))
}

function sendGameCards(game, io) {
    game.players.forEach(player => {
        sendPlayerCards(player, io);
    });
}

function nextStep(game, cardDeck, io) {
    drawCardForPlayer(game.turningPlayer(), cardDeck);
    sendGameCards(game, io);
    io.to(game.room.name).emit('move-order', new Response("Turn player id", 200, game.moveOrderId));
}

function sendPlayerCards(player, io) {
    if (player)
        io.to(player.socketId).emit('my-cards', new Response("Your cards...", 200, player.cards));
}
module.exports = { initializeGame, sendPlayerCards, sendGameCards, nextStep }