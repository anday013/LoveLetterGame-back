const fs = require('fs');
const filename = './src/db/rooms.txt';
const Room = require('../models').Room;
const Player = require('../models').Player;
const path = require('path');
let filename = path.join(__dirname, '/rooms.txt');

const changePath = async (newPath) => {
  filename = path.join(__dirname, newPath);
};

const readAll = async () => {
  try {
    let result = [];
    let text = await fs.readFileSync(filename, { encoding: 'utf-8' });
    text.split(';').forEach((x) => {
      if (x != '') {
        let object = JSON.parse(x);
        let room = new Room(object.name, object.status, object.maxPlayers);
        room.id = object.id;
        object.players.forEach((player) => {
          const newPlayer = new Player(
            player.nickname,
            player.points,
            player.socketId
          );
          room.addPlayer(newPlayer);
        });
        result.push(room);
      }
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};

const write = async (room) => {
  try {
    await fs.appendFileSync(filename, ';' + JSON.stringify(room));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const find = async (id) => {
  const allRooms = await readAll();
  const validRoom = allRooms.find((room) => room.id === id);
  return validRoom;
};

const clean = () => {
  fs.truncate(filename, 0, () => {
    console.log('Done');
  });
};

const remove = async (id) => {
  let data = await fs.readFileSync(filename, 'utf-8');
  let room = await find(id);
  if (room) {
    let newValue = data.replace(JSON.stringify(room), '');
    await fs.writeFileSync(filename, newValue, 'utf-8');
    return true;
  }
  return false;
};

const update = async (oldRoom, newRoom) => {
  let data = await fs.readFileSync(filename, 'utf-8');
  if (oldRoom && newRoom) {
    let newValue = data.replace(
      JSON.stringify(oldRoom),
      JSON.stringify(newRoom)
    );
    await fs.writeFileSync(filename, newValue, 'utf-8');
    return true;
  }
  return false;
};

module.exports = { changePath, readAll, write, find, remove, update };
