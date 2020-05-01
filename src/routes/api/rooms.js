const express = require('express');
const router = express.Router();
const Room = require('../../models').Room;
const rooms = require('../../db').rooms;
const Response = require('../../models').Response;


router.get('/', (req, res) =>{
    res.send(new Response("Done", 200 , rooms.readAll()));
})


router.get('/:id', (req, res) => {
    const found_room = rooms.find(req.params.id);
    if (found_room) {
        res.send(new Response("Done", 200 , found_room));
    }
    else
        res.send(new Response());
})

router.post('/', (req, res) => {
    if (("roomName" in req.body )&& ("maxPlayers" in req.body)) {
        let roomName = req.body.roomName;
        let max_players = req.body.maxPlayers;
        let createdRoom = new Room(roomName, max_players, 'Wait');
        rooms.write(createdRoom);
        res.send(new Response("Done", 200 , createdRoom));
    }
    else
        res.send(new Response("Wrong arguments"));
})

module.exports = router;