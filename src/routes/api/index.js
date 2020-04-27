const express = require('express');
const router = express.Router();


router.get('/', function(req,res){
    res.send("Welcome");
});

router.use('/rooms', require('./rooms'))
module.exports = router;