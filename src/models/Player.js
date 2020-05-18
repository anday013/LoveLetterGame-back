const crypto = require('crypto');
module.exports = class Player{
    constructor(nickname, points, socketId){
        this.id = socketId;
        this.nickname = nickname;
        this.points = points;
        this.socketId = socketId;
        this.cards = [];
        this.discardedCards = [];
        this.cardsCount = 0;
        this.protected = false;
    }
    addCard(card){
        this.cards.push(card);
    }
    removeCard(card){
        this.cards.splice(this.cards.findIndex(c => c.id === card.id ), 1);
        this.discardedCards.push(card);
    }
    removeAllCards(){
        this.cards.forEach(c => this.discardedCards.push(c));
        this.cards = [];
    }
    setName(name){
        this.nickname = name;
    }
    isCardMine(card){
        return card.playerId === this.id
    }
    reset(){
        this.cards = [];
        this.discardedCards = [];
        this.protected = false;
    }
    cardsCounter(){
        this.cardsCount = this.cards.length;
    }
}
