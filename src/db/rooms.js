const fs = require('fs');
const filename = './src/db/rooms.txt'

const readAll = () => {
    try {
        let result = [];
        let text = fs.readFileSync(filename, { encoding: 'utf-8' });
        text.split(';').forEach(x => {
            if (x != "") result.push(JSON.parse(x));
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


module.exports = { readAll, write, find }
