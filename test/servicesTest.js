const expect = require('chai').expect;
const dbRooms = require('../src/db/rooms');
dbRooms.changePath('/roomstest.txt');

const score = require('../src/services/score');

const Room = require('../src/models').Room;
const Game = require('../src/models').Game;

const initializeGame = async () => {
  const room = await dbRooms.find('962d7491e8ba960315fb4694a06cc9ca');
  const game = new Game(room);
  return game;
};

describe('Score.js Services', async function () {
  //win()
  const game = await initializeGame();
  console.log(game);
  it('win() function should return player.points+1 ', async function () {
    const player = game.players[0];
    player.points++;
    console.log(player);
    const winner = score.win(game, game.players[0]);
    // expect(stub.calledOnce).to.be.true;
    expect(winner.id).to.equal(player.id);
    expect(winner.nickname).to.equal(player.nickname);
    expect(winner.points).to.equal(player.points);
    expect(winner.socketId).to.equal(player.socketId);
    expect(winner.protected).to.equal(player.protected);

    // assert.isOk(await score.win(), '.');
  });
  it('loose() function should return player:  player.points-1 ', async function () {
    const player = game.players[0];
    player.points--;
    console.log(player);
    const loser = score.loose(game, game.players[0]);
    // expect(stub.calledOnce).to.be.true;
    expect(loser.id).to.equal(player.id);
    expect(loser.nickname).to.equal(player.nickname);
    expect(loser.points).to.equal(player.points);
    expect(loser.socketId).to.equal(player.socketId);
    expect(loser.protected).to.equal(player.protected);

    // assert.isOk(await score.win(), '.');
  });
});

describe('Score.js Services', async function () {
  //win()
  const game = await initializeGame();
  console.log(game);
  it('win() function should return player.points+1 ', async function () {
    const player = game.players[0];
    player.points++;
    console.log(player);
    const winner = score.win(game, game.players[0]);
    // expect(stub.calledOnce).to.be.true;
    expect(winner.id).to.equal(player.id);
    expect(winner.nickname).to.equal(player.nickname);
    expect(winner.points).to.equal(player.points);
    expect(winner.socketId).to.equal(player.socketId);
    expect(winner.protected).to.equal(player.protected);

    // assert.isOk(await score.win(), '.');
  });
  it('loose() function should return player:  player.points-1 ', async function () {
    const player = game.players[0];
    player.points--;
    console.log(player);
    const loser = score.loose(game, game.players[0]);
    // expect(stub.calledOnce).to.be.true;
    expect(loser.id).to.equal(player.id);
    expect(loser.nickname).to.equal(player.nickname);
    expect(loser.points).to.equal(player.points);
    expect(loser.socketId).to.equal(player.socketId);
    expect(loser.protected).to.equal(player.protected);

    // assert.isOk(await score.win(), '.');
  });
});
dbRooms.changePath('/rooms.txt');
