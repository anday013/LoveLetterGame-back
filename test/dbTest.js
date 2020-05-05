const assert = require('chai').assert;
const dbRooms = require('../src/db/rooms');

const Room = require('../src/models').Room;
let testRoom = new Room('Test', 'Waiting', 4);
testRoom.name = 'Test Room';

let updatedRoom = new Room('Updated', 'Waiting', 3);
updatedRoom.name = 'Updated';

describe('Rooms DB', function () {
  //readAll()
  it('readAll() function should return Array type', function () {
    assert.isArray(dbRooms.readAll(), 'Return is array.');
  });
  //write()
  it('write() function should return type Boolean', function () {
    assert.typeOf(dbRooms.write(testRoom), 'Boolean');
  });
  it('write() function should return true', function () {
    assert.equal(dbRooms.write(testRoom), true);
  });
  //find()
  it('find() function should return type object', function () {
    assert.typeOf(dbRooms.find('247e848ead0d33cf45af875459766344'), 'object');
  });

  //remove()
  it('remove() function should be Okay after process', function () {
    assert.isOk(
      dbRooms.remove('43e3c54eb3b60940280cc5e81cd90581'),
      '43e3c54eb3b60940280cc5e81cd90581 id room removed'
    );
  });
  //update()
  it('update() function should be Okay after process', function () {
    assert.isOk(dbRooms.update(testRoom, updatedRoom), 'Room updated');
  });
});
