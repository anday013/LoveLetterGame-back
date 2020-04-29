const crypto = require('crypto');
module.exports = class Room{
    constructor(name, players, status, maxPlayers){
        this.id = crypto.randomBytes(16).toString("hex");
        this.name = name;
        this.players = players;
        this.status = status;
        this.maxPlayers;
    }
}