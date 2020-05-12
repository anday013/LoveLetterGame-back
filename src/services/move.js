const deck = require('./deck');

const { guard, priest, baron, handmaid, prince, king, princess, countess} = require('./cards');

function infoHandler(relatedInfoObj, currentPlayer, game) {
    relatedInfoObj.currentPlayer = currentPlayer;
    if(relatedInfoObj.hasOwnProperty('targetPlayerId'))
        relatedInfoObj.targetPlayer = game.findPlayerById(relatedInfoObj.targetPlayerId);
    return relatedInfoObj;
}

function protectionCheck(relatedInfoObj)
{
    if(relatedInfoObj.targetPlayer){
        return relatedInfoObj.targetPlayer.protected; // true or false
    }
    return false;
}

/*
 * Handle player turnings
 * Arguments:
 *      game - current game
 *      card - turned card
 *      currentPlayer - turning player
 *      relatedInfoObj - extra information for player card (if needed)
 * Return: (String)
 *      Success - if everything ok
 *      (Error message) - else
*/
function move(game, card, currentPlayer, relatedInfoObj, cardResponse) {
    try {
        relatedInfoObj = infoHandler(relatedInfoObj, currentPlayer, game);
        if (game.turningPlayer().socketId === currentPlayer.socketId
            && game.turningPlayer().isCardMine(card)
            && deck.isExist(card, game.allCards)) {
            if(protectionCheck(relatedInfoObj))
                return "Protected";
            if(currentPlayer.cards.find(c => (c.power === 7)) &&  (card.power === 5 || card.power === 6))
                return "Wrong card playerd";
            currentPlayer.protected = false;
            game.turningPlayer().removeCard(card);
            cardResponse.result = cardSeperator(card, relatedInfoObj, game);
            console.log("Card Response in  move: " + cardResponse.result)
            game.moveOrderId = nextPlayerId(game.moveOrderId, game.activePlayers);
            return "Success";
        }
        else {
            console.error("It's not your turn");
            return "It's not your turn";
        }
    } catch (error) {
        console.error(error)
    }

}

/*
 * Handle cards and call appropirate function
 * Arguments:
 *      card - turned card
 *      relatedInfoObj - extra information for player card (if needed)
 * Return: (Void)
*/
const cardSeperator = (card, relatedInfo, game) => {
    try {
        switch (card.power) {
            case 1:
                return guard(relatedInfo.targetPlayer, relatedInfo.guessedCardPower, game);
            case 2:
                return priest(relatedInfo.targetPlayer);
            case 3:
                return baron(relatedInfo.targetPlayer, relatedInfo.currentPlayer, game);
            case 4:
                return handmaid(relatedInfo.currentPlayer, game); // +
            case 5:
                return prince(relatedInfo.targetPlayer, game); // +
            case 6:
                return king(relatedInfo.targetPlayer, relatedInfo.currentPlayer, game); // +
            case 7:
                return countess();
            case 8:
                return princess(relatedInfo.currentPlayer, game)
            default:
                break;
        }


    } catch (err) {
        console.log(err)
    }
}



/*
 * Return next turning player id
 * Arguments:
 *      moveOrderId - last turned player id
 *      players - players participating in game
 * Return: (int)
 *      Id of next player
*/
function nextPlayerId(moveOrderId, players) {
    return players[(players.findIndex(p => p.id === moveOrderId) + 1) % players.length].id;
}



module.exports = move
