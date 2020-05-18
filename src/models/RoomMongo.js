const mongoose = require('mongoose');

const RoomMongoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  players: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    required: true,
    default: 'Waiting',
  },
  maxPlayers: {
    type: Number,
    required: true,
    default: 4,
  },
});

RoomMongoSchema.methods.isFull = function () {
  return this.players.length == this.maxPlayers;
};

RoomMongoSchema.methods.isPlayerExist = function (playerId) {
  if (this.players.length !== 0) {
    console.log(this.players);
    var parsedPlayers = JSON.parse(this.players);
    console.log(parsedPlayers);
    // parsedPlayers.forEach((player) => {
    //   if (player.id === playerId) {
    //     return player;
    //   }
    // }
    // );
  }
  // this.users. == this.model('RoomMongo').maxPlayers
  return 0;
};

const RoomMongo = mongoose.model('RoomMongo', RoomMongoSchema);
module.exports = RoomMongo;
