const crypto = require('crypto');
module.exports = class Player{
    constructor(nickname, points, socket){
        this.id = socket.id;
        this.nickname = nickname;
        this.points = points;
        this.socket = socket;
        this.cards = [];
        this.isProtected = false;
    }
    addCard(card){
        this.cards.push(card);
    }
    removeCard(card){
        this.cards.splice(this.cards.indexOf(card), 1);
    }
}