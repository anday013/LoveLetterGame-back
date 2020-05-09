const crypto = require('crypto');
module.exports = class Player{
    constructor(nickname, points, socketId){
        this.id = socketId;
        this.nickname = nickname;
        this.points = points;
        this.socketId = socketId;
        this.cards = [];
        this.isProtected = false;
    }
    addCard(card){
        this.cards.push(card);
    }
    removeCard(card){
        this.cards.splice(this.cards.indexOf(card), 1);
    }
    setName(name){
        this.nickname = name;
    }
    isCardMine(card){
        return card.playerId === this.id
    }
}