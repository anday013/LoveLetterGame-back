const express = require('express');
const router = express.Router();


router.get('/', function(req,res){
    res.sendFile(__dirname + "/Front/index.html");
});

router.use('/rooms', require('./rooms'))
module.exports = router;