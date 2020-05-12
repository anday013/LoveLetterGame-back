const deck = require('./').deck;
/*
* If guessed card is exist in target player returns card, otherwise null
*/
function guard(targetPlayer, guessedCardPower, game) {
    if(targetPlayer.cards.find(c => c.power == guessedCardPower)){
        game.leaveRound(targetPlayer);
        return true;
    }
    return false;
}

/*
* Returns target player cards
*/
function priest(targetPlayer) {
    return targetPlayer.cards.filter(c => c.power === 2);
}


/*
* If current player has a stronger hand returns true, otherwise false
*/
function baron(targetPlayer, currentPlayer, game) {
    let targetPlayerPoints = 0, currentPlayerPoints = 0;
    targetPlayer.cards.forEach(element => {
        targetPlayerPoints += element.power;
    });
    currentPlayer.cards.forEach(element => {
        currentPlayerPoints += element.power;
    })
    if (currentPlayerPoints > targetPlayerPoints)
    {
        game.leaveRound(targetPlayer);
        return 1;
    }
    else if(currentPlayerPoints < targetPlayerPoints)
    {
        game.leaveRound(currentPlayer);
        return 2;
    }
    return 0
}

/*
*  Player cannot be affected by any other player's card until the next turn.
*/
function handmaid(currentPlayer, game) {
    try{
        game.activePlayers.find(p => p.id === currentPlayer.id).protected = true;
        return true;
    }catch(err){
        console.error(err)
        return false;
    }
}


function prince(targetPlayer, game) {
    try{
        discardHand(targetPlayer, game);
        if(game.activePlayers.find(p => p.id === targetPlayer.id))
            game.activePlayers.find(p => p.id === targetPlayer.id).addCard(deck.drawCardFromDeck().setPlayerId(targetPlayer.id));
        return targetPlayer.id;
    }catch(err){
        console.error(err)
        return null;
    }
}

function discardHand(targetPlayer, game) {
    try {
        targetPlayer.cards.forEach(card => {
            if (card.name === "Princess")
                princess(targetPlayer, game);
        });
        targetPlayer.cards = [];
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}


function king(targetPlayer, currentPlayer, game) {
    try{
        let opponentCards = targetPlayer.cards;
        game.activePlayers.find(p => p.id === targetPlayer.id).cards = currentPlayer.cards;
        game.activePlayers.find(p => p.id === targetPlayer.id).cards.forEach(c => c.playerId = targetPlayer.id);
        game.activePlayers.find(p => p.id === currentPlayer.id).cards = opponentCards;
        game.activePlayers.find(p => p.id === currentPlayer.id).cards.forEach(c => c.playerId = currentPlayer.id);
        return true;
    }catch(err){
        console.error(err)
        return false;
    }
}

function countess() {
    return true;
}


function princess(currentPlayer, game) {
    try{
        game.leaveRound(currentPlayer);
        return true;
    }catch(err){
        console.error(err)
        return false;
    }
}


module.exports = { guard, priest, baron, handmaid, prince, king, princess, countess}
