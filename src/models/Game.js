module.exports = class Game{
    constructor(room){
        this.players = room.players.slice(); //All players take place in game
        this.room = room; //Room
        this.activePlayers = room.players.slice(); //Players take part in current round
        this.moveOrderId = this.activePlayers[0].id; // Player move order detector
        this.allCards = []; // All cards exist in current game
        this.cardDeck = []; // Card deck of game
        this.reservedCard = null;
        this.maxScore = 4;
        if(room.players.length === 3)
            this.maxScore = 5;
        else if(room.players.length === 2)
            this.maxScore = 7;
    }

    findPlayerById(playerId){
        return this.activePlayers.find(p => p.id === playerId);
    }
    turningPlayer(){
        return this.findPlayerById(this.moveOrderId);
    }
    leaveRound(looser){
        this.activePlayers.splice(this.activePlayers.indexOf(looser), 1);
    }
    isGameEnd(){
        let winner = null;
        this.activePlayers.forEach(p => {
            if(p.points >= this.maxScore)
                winner = p;
        });
        return winner;
    }
};
