const win = (game, player) => {
    try {
        let winner = game.players.find(p => p.id === player.id);
        winner.points++;
        game.moveOrderId = winner.id;
        return winner;
    } catch (error) {
        console.error(error);
        return null;
    }
};


const loose = (game, player) => {
    try {
        player.removeAllCards();
        game.leaveRound(player);
        return player;
    } catch (error) {
        console.error(error);
        return null;
    }
};


module.exports = { win, loose };
