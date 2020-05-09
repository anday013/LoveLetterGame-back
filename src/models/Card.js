const crypto = require('crypto');
module.exports = class Card {
    constructor(name, power){
        this.id = crypto.randomBytes(16).toString("hex");
        this.name = name;
        this.power = power;
        this.playerId;
    }
    setPlayerId(playerId){
        this.playerId = playerId;
        return this;
    }
    
}
