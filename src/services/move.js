const { guard, priest, baron, handmaid, prince, king, princess } = require('./cards');
const deck = require('./').deck;
let activeCard = null;
let moveOrder = 0; // Order of move

function move(game, card, currentPlayer, relatedInfoJSON) {
    try {
        let relatedInfoObj = convertToObj(relatedInfoJSON, game);
        relatedInfoObj.currentPlayer = currentPlayer;

        if (game.players[moveOrder].socket.id == currentPlayer.socket.id
            && card.playerID == game.players[moveOrder].id
            && deck.isExist(card)) {

            activeCard = card;
            game.players[moveOrder].removeCard(card);
            cardSeperator(card, relatedInfoObj);
            moveOrder = nextPlayer(moveOrder, game.players);
        }
        else {
            console.error("It's not your turn")
        }
    } catch (error) {
        console.error(error)
    }

}


const cardSeperator = (card, relatedInfo) => {
    try {
        switch (card.name) {
            case "Guard":
                guard(relatedInfo.targetPlayer, relatedInfo.guessedCard);
                break;
            case "Priest":
                priest(relatedInfo.targetPlayer);
                break;
            case "Baron":
                baron(relatedInfo.targetPlayer, relatedInfo.currentPlayer);
                break;
            case "Handmaid":
                handmaid(relatedInfo.currentPlayer);
                break;
            case "Prince":
                prince(relatedInfo.targetPlayer);
                break;
            case "King":
                king(relatedInfo.targetPlayer, relatedInfo.currentPlayer);
                break;
            case "Countess":
                break;
            case "Princess":
                princess(relatedInfo.currentPlayer)
                break;
            default:
                break;
        }


    } catch (err) {
        console.log(err)
    }
}


function nextPlayer(moveOrder, players) {
    return moveOrder = (moveOrder + 1) % players.length;
}


function convertToObj(jsonFormat, game) {
    let obj = JSON.parse(jsonFormat);
    return {
        targetPlayer: game.findPlayerByName(obj.targetPlayerName),
        guessedCard: obj.guessedCardName
    }


}

module.exports = move