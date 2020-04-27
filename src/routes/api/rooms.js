const express = require('express');
const router = express.Router();
const Room = require('../../models').Room;
const crypto = require('crypto');
const rooms = require('../../db').rooms;

router.get('/', (req,res) => res.send(rooms.readAll()));


router.get('/:id', (req,res) => {
    const found_room = rooms.find(req.params.id);
    if(found_room)
        res.send(found_room)
    else 
        res.sendStatus(404);
})

router.post('/',  (req,res) => {
    let roomName = req.body.roomName;
    let player = req.body.player;
    if(roomName && player){
        rooms.write(new Room(req.body.roomName,req.body.player,'Wait'));
        res.sendStatus(200);
    }
    else
        res.send("Wrong request structure");
})

module.exports = router;