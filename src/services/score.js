const win = (player) => {
    try {
        player.points++;
        return true;            
    } catch (error) {
        console.error(error)
        return false;
    }
}


const loose = (player) => {
    try {
        if(player.points > 0)
            player.points--;
        return true;        
    } catch (error) {
        console.error(error)
        return false;
    }
}


module.exports = { win, loose }