const deck = require('./deck');
const score = require('./score');
/*
* If guessed card is exist in target player returns card, otherwise null
*/
function guard(targetPlayer, guessedCardPower, game) {
    if(targetPlayer.cards.find(c => c.power == guessedCardPower)){
        return score.loose(game,targetPlayer);
    }
    return null;
}

/*
* Returns target player cards
*/
function priest(targetPlayer) {
    return targetPlayer.cards.slice();
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
    });
    if (currentPlayerPoints > targetPlayerPoints)
    {
        return score.loose(game,targetPlayer);
    }
    else if(currentPlayerPoints < targetPlayerPoints)
    {
        return score.loose(game,currentPlayer);
    }
    return null;
}

/*
*  Player cannot be affected by any other player's card until the next turn.
*/
function handmaid(currentPlayer, game) {
    try{
        game.activePlayers.find(p => p.id === currentPlayer.id).protected = true;
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}


function prince(targetPlayer, game) {
    try{
        discardHand(targetPlayer, game);
        let drawCard = deck.drawCardFromDeck(game.cardDeck);
        if(game.activePlayers.find(p => p.id === targetPlayer.id))
            if(drawCard)
                game.activePlayers.find(p => p.id === targetPlayer.id).addCard(drawCard.setPlayerId(targetPlayer.id));
            else
                game.activePlayers.find(p => p.id === targetPlayer.id).addCard(game.reservedCard.setPlayerId(targetPlayer.id));

        return targetPlayer.id;
    }catch(err){
        console.error(err);
        return null;
    }
}

function discardHand(targetPlayer, game) {
    try {
        targetPlayer.cards.forEach(card => {
            if (card.name === "Princess")
                princess(targetPlayer, game);
        });
        game.activePlayers.find(p => p.id === targetPlayer.id).cards = [];
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
        console.error(err);
        return false;
    }
}

function countess() {
    return true;
}


function princess(currentPlayer, game) {
    try{
        return score.loose(game,currentPlayer);
    }catch(err){
        console.error(err);
        return null;
    }
}


module.exports = { guard, priest, baron, handmaid, prince, king, princess, countess}
