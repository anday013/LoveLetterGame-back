const assert = require('chai').assert;
const dbRooms = require('../src/db/rooms');

const Room = require('../src/models').Room;
let testRoom = new Room('Test', 'Waiting', 4);
testRoom.name = 'Test Room';

let updatedRoom = new Room('Updated', 'Waiting', 3);
updatedRoom.name = 'Updated';

dbRooms.changePath('/roomstest.txt');

describe('Rooms DB', function () {
  //readAll()
  it('readAll() function should return Array type', async function () {
    assert.isArray(await dbRooms.readAll(), 'Return is array.');
  });
  //write()
  it('write() function should return type Boolean', async function () {
    assert.typeOf(await dbRooms.write(testRoom), 'Boolean');
  });
  it('write() function should return true', async function () {
    assert.equal(await dbRooms.write(testRoom), true);
  });
  //find()
  it('find() function should return type object', async function () {
    assert.typeOf(
      await dbRooms.find('962d7491e8ba960315fb4694a06cc9ca'),
      'object'
    );
  });

  //find2()
  it('find2() function must return object id same with find id', async function () {
    const room = await dbRooms.find('962d7491e8ba960315fb4694a06cc9ca');
    assert.equal(
      room.id,
      '962d7491e8ba960315fb4694a06cc9ca',
      'room id equal to id'
    );
  });

  //   //remove()
  //   it('remove() function should be Okay after process', async function () {
  //     assert.equal(
  //       await dbRooms.remove('412d5cf072af02e43f6a5e5134c3bee9'),
  //       true
  //       '412d5cf072af02e43f6a5e5134c3bee9 id room removed'
  //     );
  //   });
  //   //update()
  //   it('update() function should be Okay after process', async function () {
  //     assert.equal(await dbRooms.update(testRoom, updatedRoom), true ,'Room updated');
  //   });
});

// dbRooms.changePath('/rooms.txt');
