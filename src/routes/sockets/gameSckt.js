module.exports = gameSckt = (io, socket) => {
    const deck = require('../../services').deck;
    const Player = require('../../models').Player;
    const move = require('../../services').move;
    const Game = require('../../models').Game;

    let newGame = new Game();
    let currentPlayer = new Player('p' + newGame.players.length.toString(), 0, socket);
    
    initialActions();


    /*
    * When player is turning
    */
    socket.on('move', (card, relatedInfoJSON) => {
       try {
           move(newGame, card, currentPlayer, relatedInfoJSON);
       } catch (error) {
           console.error(error)
       }
    });


    socket.on('get mycards',() => sendPlayerCards());



    function sendPlayerCards(){
        socket.emit('my cards', currentPlayer.cards);
    }


    function initialActions(){
        newGame.addPlayer(currentPlayer)
        deck.prepareDeck(4);
    
        let drawedCard = deck.drawCard().setPlayerId(currentPlayer.id)
        currentPlayer.addCard(drawedCard);
    
        sendPlayerCards();
    }




} 