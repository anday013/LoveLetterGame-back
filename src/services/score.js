const win = (player, game) => {
    try {
        let winner = game.players.find(p => p.id === player.id);
        winner.points++;
        return winner;            
    } catch (error) {
        console.error(error)
        return null;
    }
}


const loose = (player, game) => {
    try {
        game.leaveRound(player);
        return player;        
    } catch (error) {
        console.error(error)
        return null;
    }
}


module.exports = { win, loose }