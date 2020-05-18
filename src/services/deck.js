const crypto = require('crypto');
const Card = require('./../models').Card;


function makeCards() {
    let guard = new Card("Guard", 1);
    let priest = new Card("Priest", 2);
    let baron = new Card("Baron", 3);
    let handmaid = new Card("Handmaid", 4);
    let prince = new Card("Prince", 5);
    let king = new Card("King", 6);
    let countess = new Card("Countess", 7);
    let princess = new Card("Princess", 8);
    return {
        guard: guard,
        priest: priest,
        baron: baron,
        handmaid: handmaid,
        prince: prince,
        king: king,
        countess: countess,
        princess: princess,
    }

}


/*
 * Number of players can be [2-4] otherwise throw custom error
 * Return valid card deck respect number of players passed as an argument
 */
function makeCardDeck(numOfPlayers) {
    const cards = makeCards();
    const cardDeck = [];
    cardDeck.push(cards.guard, cards.priest, cards.baron, cards.handmaid, cards.prince, cards.king, cards.countess, cards.princess);
        /*
         * There are 16 cards in the deck:
         * 5 Guard,2 Priest, 2 Baron, 2 Handmaid, 2 Prince, 1 King, 1 Countess and 1 Princess
         */
        for (let i = 0; i < 4; i++) {
            cardDeck.push(new Card("Guard", 1));
        }
        cardDeck.push(new Card("Priest", 2), new Card("Baron", 3), new Card("Handmaid", 4), new Card("Prince", 5));
    return cardDeck;
}




const prepareDeck = (numOfPlayers) => {
    let cardDeck = makeCardDeck(numOfPlayers);
    for (let index = 0; index < 10; index++) {
        shuffle(cardDeck);
    }
    return cardDeck;
}


/*
 * Return top card from card desk
 * until there is card otherwise null
 */
function drawCardFromDeck(cardDeck) {
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
function isExist(card, allCards) {
    if (allCards.find(c => c.id === card.id))
        return true
    return false
}



module.exports = { prepareDeck, drawCardFromDeck, isExist };


