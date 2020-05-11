const deck = require('./deck');

const { guard, priest, baron, handmaid, prince, king, princess } = require('./cards');

function infoHandler(relatedInfoObj, currentPlayer) {
    relatedInfoObj.currentPlayer = currentPlayer;
    if(targetPlayerId in relatedInfoObj)
        relatedInfoObj.targetPlayer = game.findPlayerById(obj.targetPlayerId);
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
function move(game, card, currentPlayer, relatedInfoObj) {
    try {
        infoHandler(relatedInfoObj, currentPlayer);
        if (game.turningPlayer().socketId === currentPlayer.socketId
            && game.turningPlayer().isCardMine(card)
            && deck.isExist(card, game.allCards)) {
            currentPlayer.isProtected = false;
            game.turningPlayer().removeCard(card);
            cardSeperator(card, relatedInfoObj, game);
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
        switch (card.name) {
            case "Guard":
                guard(relatedInfo.targetPlayer, relatedInfo.guessedCard, game);
                break;
            case "Priest":
                priest(relatedInfo.targetPlayer);
                break;
            case "Baron":
                baron(relatedInfo.targetPlayer, relatedInfo.currentPlayer);
                break;
            case "Handmaid":
                handmaid(relatedInfo.currentPlayer); // +
                break;
            case "Prince":
                prince(relatedInfo.targetPlayer); // +
                break;
            case "King":
                king(relatedInfo.targetPlayer, relatedInfo.currentPlayer); // +
                break;
            case "Countess":
                break;
            case "Princess":
                princess(relatedInfo.currentPlayer, game)
                break;
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
