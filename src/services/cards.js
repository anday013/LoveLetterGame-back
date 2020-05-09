const deck = require('./').deck;
/*
* If guessed card is exist in target player returns true, otherwise false
*/
function guard(targetPlayer, guessedCard) {
    if (targetPlayer.cards.find(c => c.name == guessedCard.name)){
        return true;
    }
    return false;
}

/*
* Returns target player cards
*/
function priest(targetPlayer) {
    return targetPlayer.cards;
}


/*
* If current player has a stronger hand returns true, otherwise false
*/
function baron(targetPlayer, currentPlayer) {
    let targetPlayerPoints = 0, currentPlayerPoints = 0;
    targetPlayer.cards.forEach(element => {
        targetPlayerPoints += element.power;
    });
    currentPlayer.cards.forEach(element => {
        currentPlayerPoints += element.power;
    })
    if (currentPlayerPoints > targetPlayerPoints)
        return true;
    return false
}

/*
*  Player cannot be affected by any other player's card until the next turn.
*/
function handmaid(currentPlayer) {
    currentPlayer.isProtected = true;
}


function prince(targetPlayer) {
    discardHand(targetPlayer);
    targetPlayer.addCard(cardDeck.drawCard().setPlayerId(targetPlayer.id))
}

function discardHand(targetPlayer) {
    targetPlayer.cards.forEach(card => {
        if (card.name === "Princess")
            princess(targetPlayer);
    })
    targetPlayer.cards = [];
}


function king(targetPlayer, currentPlayer) {
    let opponentCards = targetPlayer.cards;
    targetPlayer.cards = currentPlayer.cards;
    currentPlayer.cards = opponentCards;
}



function princess(currentPlayer) {

}


module.exports = { guard, priest, baron, handmaid, prince, king, princess }