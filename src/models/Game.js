class Game{
    constructor(){
        this.players = []; //All players take place in game
        this.room = ''; //Room name
        this.activePlayers = []; //Players take part in current round
    }

    findPlayerByName(playerName){
        return this.players.find(p => p.name === playerName);
    }
}