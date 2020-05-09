const express = require('express');
const router = express.Router();
const roomRouter = require('./rooms');

router.get('/', function(req,res){
    res.send("Welcome");
});

router.use('/rooms', roomRouter)
module.exports = router;