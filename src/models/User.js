const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },

    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    playerId: {
        type: String,
        default: -1
        // required: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
