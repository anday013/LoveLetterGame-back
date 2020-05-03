module.exports = class Game{
    constructor(room){
        this.players = room.players; //All players take place in game
        this.room = room; //Room
        this.activePlayers = room.players; //Players take part in current round
        this.moveOrderId = this.activePlayers[0].id;
    }

    findPlayerByName(playerName){
        return this.activePlayers.find(p => p.name === playerName);
    }
    findPlayerById(playerId){
        return this.activePlayers.find(p => p.id === playerId);
    }
}