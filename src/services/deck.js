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
        cardDeck.push(new Card("Guard", 1), new Card("Priest", 2), new Card("Guard", 1), new Card("Baron", 3), new Card("Handmaid", 4), new Card("Guard", 1), new Card("Prince", 5), new Card("Guard", 1));
    return cardDeck;
}




const prepareDeck = (numOfPlayers) => {
    let cardDeck = makeCardDeck(numOfPlayers);
    cardDeck = shuffle(cardDeck);
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
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
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


