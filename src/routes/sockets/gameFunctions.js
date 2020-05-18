const deck = require('../../services').deck;
const score = require('../../services').score;
const move = require('../../services').move;
const Game = require('../../models').Game;
const Response = require('../../models').Response;
const Player = require('../../models').Player;
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
    game.reservedCard = deck.drawCardFromDeck(game.cardDeck);

    if (game.room.maxPlayers === 2)
        twoPlayerMod(game);


    game.players.forEach(player => {
        drawCardForPlayer(player, game);
    });
    nextStep(game, io);
}
///////////////////////////////////////////////////
function newRound(game, io) {
    game.players.forEach(p => p.reset());
    game.activePlayers = game.players.slice();
    initialActions(game, io);
    let winner = game.checkForWinner();
    if(winner)
        io.to(game.room.name).emit('game-end', new Response("Game end", 200, winner))
    

    return game;

}



function checkForWinner(game) {
    if (game.activePlayers.length == 1) {
        return score.win(game, game.activePlayers[0]);
    } else if (!game.cardDeck.length) {
        return comparePlayersHand(game.activePlayers, game);
    }
    game.activePlayers.forEach(p => {
        if(p.score >= game.maxScore)
            return p;
    })
    return null;
}


function comparePlayersHand(players, game) {
    let cardPower = 0;
    let winner = null
    players.forEach(player => {
        if (player.cards[0].power > cardPower) {
            cardPower = player.cards[0].power;
            winner = player;
        }
        player.removeAllCards();
    });
    return score.win(game, winner);
}


function nextStep(game, io) {
    if (!game.cardDeck.length)
        return false;
    drawCardForPlayer(game.turningPlayer(), game);
    sendGameCards(game, io);
    io.to(game.room.name).emit('move-order', new Response("Turn player id", 200, game.moveOrderId));
    return true;
}


function sendPlayersWithoutCards(players, io, game){
    let players_copy = [];
    players.forEach(p => {
        let p_copy = new Player(p.nickname, p.points, p.socketId);
        p_copy.id = p.id;
        p_copy.discardedCards = p.discardedCards;
        p_copy.protected = p.protected;
        p.cardsCounter();
        p_copy.cardsCount = p.cardsCount;
        players_copy.push(p_copy);
    });
    io.to(game.room.name).emit('active-players', new Response("Active players",200, players_copy))
}

//////////////////////////////////

function twoPlayerMod(game) {
    for (let i = 0; i < 3; i++)
        deck.drawCardFromDeck(game.cardDeck)
}

function drawCardForPlayer(player, game) {
    player.addCard(deck.drawCardFromDeck(game.cardDeck).setPlayerId(player.id))
}

function sendGameCards(game, io) {
    game.players.forEach(player => {
        sendPlayerCards(player, io);
    });
}


function sendPlayerCards(player, io) {
    if (player)
        io.to(player.socketId).emit('my-cards', new Response("Your cards...", 200, player.cards));
}

module.exports = { initializeGame,  nextStep, newRound, checkForWinner, sendPlayersWithoutCards}
