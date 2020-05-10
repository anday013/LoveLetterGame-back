const deck = require('./').deck;
/*
* If guessed card is exist in target player returns card, otherwise null
*/
function guard(targetPlayer, guessedCard, game) {
    if(targetPlayer.cards.find(c => c.name === guessedCard.name)){
        game.leaveRound(targetPlayer);
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
        return true;
    }
    game.leaveRound(currentPlayer)
    return false
}

/*
*  Player cannot be affected by any other player's card until the next turn.
*/
function handmaid(currentPlayer) {
    try{
        currentPlayer.isProtected = true;
        return true;
    }catch(err){
        console.error(err)
        return false;
    }
}


function prince(targetPlayer) {
    try{
        discardHand(targetPlayer);
        targetPlayer.addCard(cardDeck.drawCardFromDeck().setPlayerId(targetPlayer.id))
        return true;
    }catch(err){
        console.error(err)
        return false;
    }
}

function discardHand(targetPlayer) {
    try {
        targetPlayer.cards.forEach(card => {
            if (card.name === "Princess")
                princess(targetPlayer);
        })
        targetPlayer.cards = [];
        return true;
        
    } catch (error) {
        console.error(error);
        return false;
    }
}


function king(targetPlayer, currentPlayer) {
    try{
        let opponentCards = targetPlayer.cards;
        targetPlayer.cards = currentPlayer.cards;
        currentPlayer.cards = opponentCards;
        return true;
    }catch(err){
        console.error(err)
        return false;
    }
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


module.exports = { guard, priest, baron, handmaid, prince, king, princess }