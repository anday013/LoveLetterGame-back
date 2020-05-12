const crypto = require('crypto');
module.exports = class Player{
    constructor(nickname, points, socketId){
        this.id = socketId;
        this.nickname = nickname;
        this.points = points;
        this.socketId = socketId;
        this.cards = [];
        this.discardedCards = [];
        this.protected = false;
    }
    addCard(card){
        this.cards.push(card);
    }
    removeCard(card){
        this.cards.splice(this.cards.findIndex(c => c.id === card.id ), 1);
        this.discardedCards.push(card);
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
}
