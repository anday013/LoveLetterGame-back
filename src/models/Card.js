const crypto = require('crypto');
module.exports = class Card {
    constructor(name, power){
        this.id = crypto.randomBytes(16).toString("hex");
        this.name = name;
        this.power = power;
        this.playerID;
    }
    setPlayerId(playerID){
        this.playerID = playerID;
        return this;
    }
    
}
