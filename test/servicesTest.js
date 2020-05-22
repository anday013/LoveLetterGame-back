const expect = require('chai').expect;
const dbRooms = require('../src/db/rooms');
dbRooms.changePath('/roomstest.txt');

const Score = require('../src/services/score');
const Deck = require('../src/services/deck');
const Cards = require('../src/services/cards');

const Room = require('../src/models').Room;
const Game = require('../src/models').Game;

const initializeGame = async () => {
  const room = await dbRooms.find('962d7491e8ba960315fb4694a06cc9ca');
  const game = new Game(room);
  return game;
};

describe('Tests for: score.js Services', async function () {
  //win()
  const game = await initializeGame();
  it('win() function should return player.points+1 ', async function () {
    const player = game.players[0];
    player.points++;
    console.log(player);
    const winner = Score.win(game, game.players[0]);
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
    const loser = Score.loose(game, game.players[0]);
    // expect(stub.calledOnce).to.be.true;
    expect(loser.id).to.equal(player.id);
    expect(loser.nickname).to.equal(player.nickname);
    expect(loser.points).to.equal(player.points);
    expect(loser.socketId).to.equal(player.socketId);
    expect(loser.protected).to.equal(player.protected);

    // assert.isOk(await score.win(), '.');
  });
});

describe('Tests for: deck.js Services', async function () {
  //makeCards()
  const testDeck = Deck.prepareDeck();
  console.log(testDeck);
  it('prepareDeck() function should return 12 cards', async function () {
    expect(testDeck).to.not.have.lengthOf(16); //bax buna
    // const player = game.players[0];
    // expect(winner.id).to.equal(player.id);
    // expect(winner.nickname).to.equal(player.nickname);
    // expect(winner.points).to.equal(player.points);
    // expect(winner.socketId).to.equal(player.socketId);
    // expect(winner.protected).to.equal(player.protected);
    // // assert.isOk(await score.win(), '.');
  });
  const card = Deck.drawCardFromDeck(testDeck);
  it('drawCardFromDeck() : after drawing card, card can not be in deck', async function () {
    expect(testDeck).to.not.include(card);
    //   const player = game.players[0];
    //   player.points--;
    //   console.log(player);
    //   const loser = score.loose(game, game.players[0]);
    //   // expect(stub.calledOnce).to.be.true;
    //   expect(loser.id).to.equal(player.id);
    //   expect(loser.nickname).to.equal(player.nickname);
    //   expect(loser.points).to.equal(player.points);
    //   expect(loser.socketId).to.equal(player.socketId);
    //   expect(loser.protected).to.equal(player.protected);
    //   // assert.isOk(await score.win(), '.');
  });
  it('isExist() function should return true, if card exist', async function () {
    expect(Deck.isExist(testDeck[0], testDeck)).to.be.true;
    //   const player = game.players[0];
    //   player.points--;
    //   console.log(player);
    //   const loser = score.loose(game, game.players[0]);
    //   // expect(stub.calledOnce).to.be.true;
    //   expect(loser.id).to.equal(player.id);
    //   expect(loser.nickname).to.equal(player.nickname);
    //   expect(loser.points).to.equal(player.points);
    //   expect(loser.socketId).to.equal(player.socketId);
    //   expect(loser.protected).to.equal(player.protected);
    //   // assert.isOk(await score.win(), '.');
  });
});

describe('Tests for: cards.js Services', async function () {
  const game = await initializeGame();
  it("guard() function should return null if don't guessed correctly", async function () {
    const player = game.players[0];
    console.log('cards' + player.cards);
    const res = Cards.guard(player, 2, game);
    expect(res).to.be.null; //bax buna
    // const player = game.players[0];
    // expect(winner.id).to.equal(player.id);
    // expect(winner.nickname).to.equal(player.nickname);
    // expect(winner.points).to.equal(player.points);
    // expect(winner.socketId).to.equal(player.socketId);
    // expect(winner.protected).to.equal(player.protected);
    // // assert.isOk(await score.win(), '.');
  });
  const card = Deck.drawCardFromDeck(testDeck);
  it('after drawing card, card can not be in deck', async function () {
    expect(testDeck).to.not.include(card);
    //   const player = game.players[0];
    //   player.points--;
    //   console.log(player);
    //   const loser = score.loose(game, game.players[0]);
    //   // expect(stub.calledOnce).to.be.true;
    //   expect(loser.id).to.equal(player.id);
    //   expect(loser.nickname).to.equal(player.nickname);
    //   expect(loser.points).to.equal(player.points);
    //   expect(loser.socketId).to.equal(player.socketId);
    //   expect(loser.protected).to.equal(player.protected);
    //   // assert.isOk(await score.win(), '.');
  });
});

dbRooms.changePath('/rooms.txt');
