const fs = require('fs');
const Room = require('../models').Room;
const Player = require('../models').Player;
const path = require('path');
const filename = path.join(__dirname, '/rooms.txt');

const readAll = () => {
    try {
        let result = [];
        let text = fs.readFileSync(filename, { encoding: 'utf-8' });
        text.split(';').forEach(x => {
            if (x != "") {
                let object = JSON.parse(x);
                let room = new Room(object.name, object.status, object.maxPlayers)
                room.id = object.id;
                object.players.forEach(player => {
                    const newPlayer = new Player(player.nickname, player.points, player.socketId);
                    room.addPlayer(newPlayer);
                })
                result.push(room);
            }
        });
        return result;
    } catch (error) {
        console.error(error)
    }
}

const write = (room) => {
    try {
        fs.appendFileSync(filename, ';' + JSON.stringify(room));
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

const find = (id) => {
    return readAll().find(room => room.id === id);
}


const clean = () => {
    fs.truncate(filename, 0, () => { console.log("Done") })
}


const remove = async (id) => {
    let data = await fs.readFileSync(filename, 'utf-8');
    let room = find(id);
    if (room) {
        let newValue = data.replace(JSON.stringify(room), '');
        await fs.writeFileSync(filename, newValue, 'utf-8');
    }
}


const update =  async (oldRoom, newRoom) => {
    let data = await fs.readFileSync(filename, 'utf-8');
    if (oldRoom && newRoom) {
        let newValue = data.replace(JSON.stringify(oldRoom), JSON.stringify(newRoom));
        await fs.writeFileSync(filename, newValue, 'utf-8');
    }
}


module.exports = { readAll, write, find, remove, update }
