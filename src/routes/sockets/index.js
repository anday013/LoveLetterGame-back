let sockets = {};
sockets.init = (server) => {
  let io = require('socket.io').listen(server);
  let crypto = require('crypto');
  let connections = [];
  const roomSckt = require('./roomSckt');
  const Player = require('../../models').Player;
  const User = require('../../models/User');
  // const verifyUser = require('../../middleware/auth');
  const jwt = require('jsonwebtoken');
  const config = require('config');
  const mongoose = require('mongoose');
  let userId;

  io.use(
    function (socket, next) {
      // if (socket.handshake.query && socket.handshake.query.token) {

      jwt.verify(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWViYWE2OWNjYzBlZmU2OTU2ZTQyNDczIn0sImlhdCI6MTU4OTI5MDY1Mn0.SVYn_0xd0JNGTeiSRGiIkZSNHX7gOkcO0QuBHKKMQX4',
        config.get('jwtSecret'),
        (error, decoded) => {
          if (error) {
            return res.status(401).json({
              msg: 'Token is not valid',
            });
          } else {
            userId = decoded.user;
            next();
          }
        }
      );
    }
    // }
  ).on('connection', async function (socket) {
    connections.push(socket);
    console.log(userId.id);

    let currentPlayer = new Player(
      'player' + crypto.randomBytes(16).toString('hex'),
      0,
      socket.id
    );

    let user = await User.findOneAndUpdate(
      {
        _id: userId.id,
      },
      {
        playerId: currentPlayer.id,
      }
    );
    console.log('-------------------------');

    // user.playerId = currentPlayer.id;
    console.log('player id' + user.playerId);
    console.log('-------------------------');
    // console.log(user);
    console.log('-------------------------');
    // user.save();

    //Connected
    console.log(
      'Connected: current number of players is %s',
      connections.length
    );

    //Game part
    roomSckt(io, socket, currentPlayer);
    //Disconnected
    socket.on('disconnect', function (data) {
      connections.splice(connections.indexOf(socket), 1);
      console.log(
        'Disconnected: current number of players is %s',
        connections.length
      );
    });

    io.of('/rooms').on('connection', (socket) => {
      console.log(socket.id);
    });
  });

  // })
};

module.exports = sockets;
