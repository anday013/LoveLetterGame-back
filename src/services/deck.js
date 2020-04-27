const crypto = require('crypto');
let cards = require('../constants');
let cardDeck = [];
let allCards = [];

/*
 * Number of players can be [2-4] otherwise throw custom error
 * Return valid card deck respect number of players passed as an argument
 */
function makeCardDesk(numOfPlayers, cardDesk) {
    cardDeck.push(cards.guard, cards.priest, cards.baron, cards.handmaid, cards.prince, cards.king, cards.countess, cards.princess);
    if (numOfPlayers == 2) {

    }
    else if (numOfPlayers == 4) {
        /*
         * There are 16 cards in the deck:
         * 5 Guard,2 Priest, 2 Baron, 2 Handmaid, 2 Prince, 1 King, 1 Countess and 1 Princess
         */
        for (let i = 0; i < 4; i++) {

            cards.guard.id = crypto.randomBytes(16).toString("hex");
            cardDeck.push(cards.guard)
        }
        cards.priest.id = crypto.randomBytes(16).toString("hex");
        cards.baron.id = crypto.randomBytes(16).toString("hex");
        cards.handmaid.id = crypto.randomBytes(16).toString("hex");
        cards.prince.id = crypto.randomBytes(16).toString("hex");
        cardDeck.push(cards.priest, cards.baron, cards.handmaid, cards.prince);
    } else
        throw new Error("Invalid number of players");
    
    allCards = cardDeck.slice();
}




const prepareDeck = (numOfPlayers) => {
    makeCardDesk(numOfPlayers, cardDeck);

    for (let index = 0; index < 10; index++) {
        shuffle(cardDeck);
    }

}


/*
 * Return top card from card desk
 * until there is card otherwise null
 */
function drawCard() {
    try {
        return cardDeck.pop();
    } catch (error) {
        console.error("No more card in in Card Deck")
        return null;
    }

}

/*
 * Shuffle a card deck
 */
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}


/*
* Does the card belong to current game
*/
function isExist(card) {
    if (allCards.find(c => c.id === card.id))
        return true
    return false
}



module.exports = { prepareDeck, drawCard, isExist };


