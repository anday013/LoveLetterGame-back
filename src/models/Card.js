const crypto = require('crypto');
module.exports = class Card {
    constructor(name, power) {
        this.id = crypto.randomBytes(16).toString("hex");
        this.name = name;
        this.power = power;
        this.playerId;
    }
    setPlayerId(playerId) {
        this.playerId = playerId;
        return this;
    }
    isSelfPlayable() {
        return this.power === 4 || this.power === 5 || this.power === 7 || this.power === 8;
    }

}
