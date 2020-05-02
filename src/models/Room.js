const crypto = require('crypto');
module.exports = class Room{
    constructor(name, status, maxPlayers){
        this.id = crypto.randomBytes(16).toString("hex");
        this.name = name;
        this.players = [];
        this.status = status;
        this.maxPlayers = maxPlayers;
    }
    addPlayer(player){
        this.players.push(player);
    }
    isFull(){
        return this.players.length == this.maxPlayers;
    }
    isPlayerExist(playerId){
        return this.players.find(p => p.id == playerId)
    }
}