const deck = require('./deck');
const Card = require('../models').Card;

const { guard, priest, baron, handmaid, prince, king, princess, countess} = require('./cards');

function infoHandler(relatedInfoObj, currentPlayer, game) {
    relatedInfoObj.currentPlayer = currentPlayer;
    if(relatedInfoObj.hasOwnProperty('targetPlayerId')){
        if(!(relatedInfoObj.targetPlayer = game.findPlayerById(relatedInfoObj.targetPlayerId)))
            return null;
    }

    if(relatedInfoObj.hasOwnProperty('guessedCardPower'))
        relatedInfoObj.guessedCardPower = Number(relatedInfoObj.guessedCardPower);
    return relatedInfoObj;
}

function protectionCheck(relatedInfoObj)
{
    if(relatedInfoObj.targetPlayer){
        return relatedInfoObj.targetPlayer.protected; // true or false
    }
    return false;
}
// if all players protected return undefined else return unprotected player
function allProtectedCheck(currentPlayer, game){
    return game.activePlayers.filter(ap => ap.id !== currentPlayer.id).find(ap => !ap.protected);
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
function move(game, cardObj, currentPlayer, relatedInfoObj, cardResponse) {
    try {
        if(!(relatedInfoObj = infoHandler(relatedInfoObj, currentPlayer, game)))
                return "Wrong target player id";
        let card = convertObjToCard(cardObj);
        if (game.turningPlayer().socketId === currentPlayer.socketId
            && game.turningPlayer().isCardMine(card)
            && deck.isExist(card, game.allCards)) {
            currentPlayer.protected = false;
            if(protectionCheck(relatedInfoObj) && allProtectedCheck(currentPlayer, game))
                return "Protected";

            if(!allProtectedCheck(currentPlayer, game) && hasSelfPlayableCard(currentPlayer) && !card.isSelfPlayable())
                return "All players protected but you have self playable card";
            if(currentPlayer.cards.find(c => (c.power === 7)) &&  (card.power === 5 || card.power === 6))
                return "Wrong card played";
            if(relatedInfoObj.targetPlayerId === currentPlayer.id && !card.isSelfPlayable())
                return "Card is not self playable";
            game.turningPlayer().removeCard(card);
            if(allProtectedCheck(currentPlayer, game) || card.isSelfPlayable())
                cardResponse.result = cardSeperator(card, relatedInfoObj, game);
            else{
                game.moveOrderId = nextPlayerId(game.moveOrderId, game.activePlayers);
                return "All players protected";
            }

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



function convertObjToCard(cardObj){
    let cardClass = new Card(cardObj.name, cardObj.power);
    cardClass.id = cardObj.id;
    cardClass.playerId = cardObj.playerId;
    return cardClass;
}

function hasSelfPlayableCard(player){
    player.cards.forEach(card => {
        if(card.isSelfPlayable())
            return true;
    });
    return false;
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
                return princess(relatedInfo.currentPlayer, game);
            default:
                break;
        }


    } catch (err) {
        console.error(err)
    }
};



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



module.exports = move;
