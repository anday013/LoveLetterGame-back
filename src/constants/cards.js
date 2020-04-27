const Card = require('../models/Card');
const crypto = require('crypto');

let guard = new Card("Guard", 1, null);
let priest = new Card("Priest", 2, null);
let baron = new Card("Baron", 3, null);
let handmaid = new Card("Handmaid", 4, null);
let prince = new Card("Prince", 5, null);
let king = new Card("King", 6, null);
let countess = new Card("Countess", 7, null);
let princess = new Card("Princess", 8, null);

module.exports = {
    guard: guard,
    priest: priest,
    baron: baron,
    handmaid: handmaid,
    prince: prince,
    king: king,
    countess: countess,
    princess: princess,
}