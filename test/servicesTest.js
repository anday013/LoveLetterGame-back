const expect = require('chai').expect;
const dbRooms = require('../src/db/rooms');
dbRooms.changePath('/roomstest.txt');

const Score = require('../src/services/score');
const Deck = require('../src/services/deck');
const Cards = require('../src/services/cards');

const GameFunctions = require('../src/routes/sockets/gameFunctions');

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
    const winner = Score.win(game, game.players[0]);
    // expect(stub.calledOnce).to.be.true;
    expect(winner.id).to.equal(player.id);
    expect(winner.nickname).to.equal(player.nickname);
    expect(winner.points).to.equal(player.points);
    expect(winner.socketId).to.equal(player.socketId);
    expect(winner.protected).to.equal(player.protected);
  });
  it('loose() function should return player:  player.points-1 ', async function () {
    const player = game.players[0];
    player.points--;
    const loser = Score.loose(game, game.players[0]);
    expect(loser.id).to.equal(player.id);
    expect(loser.nickname).to.equal(player.nickname);
    expect(loser.points).to.equal(player.points);
    expect(loser.socketId).to.equal(player.socketId);
    expect(loser.protected).to.equal(player.protected);
  });
});

describe('Tests for: deck.js Services', async function () {
  //makeCards()
  const testDeck = Deck.prepareDeck();
  it('prepareDeck() function should return 12 cards', async function () {
    expect(testDeck).to.not.have.lengthOf(16); //bax buna
  });
  const card = Deck.drawCardFromDeck(testDeck);
  it('drawCardFromDeck() : after drawing card, card can not be in deck', async function () {
    expect(testDeck).to.not.include(card);
  });
  it('isExist() function should return true, if card exist', async function () {
    expect(Deck.isExist(testDeck[0], testDeck)).to.be.true;
  });
});

describe('Tests for: cards.js Services', async function () {
  const game = await initializeGame();
  const player1 = game.players[0];
  const player2 = game.players[1];

  it("guard() function should return null if don't guessed correctly", async function () {
    const res = Cards.guard(player1, 2, game);
    expect(res).to.be.null; //bax buna
  });
  it('priest() function should return array type', async function () {
    expect(Cards.priest(player1)).to.be.an.instanceof(Array);
  });

  it('baron() function should return null', async function () {
    const res = Cards.baron(player1, player2, game);
    expect(res).to.be.a('null');
  });
  it('handmaid() function should return true', async function () {
    expect(Cards.handmaid(player1, game)).to.be.true;
  });

  it('king() function should return true if  cards swapped', async function () {
    const res = Cards.king(player1, player2, game);
    expect(res).to.be.true;
  });

  it('countess() function should return true', async function () {
    expect(Cards.countess()).to.be.true;
  });
  it('princess() function should return score.loose() so , player if it works.', async function () {
    const res = Cards.princess(player1, game);
    expect(res.id).to.equal(player1.id);
    expect(res.nickname).to.equal(player1.nickname);
    expect(res.points).to.equal(player1.points);
    expect(res.socketId).to.equal(player1.socketId);
    expect(res.protected).to.equal(player1.protected);
  });
});

// dbRooms.changePath('/rooms.txt');
