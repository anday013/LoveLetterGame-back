

module.exports = roomSckt = (io, socket) =>{
    io.on('enter-room', (room, player) => {
        socket.join(room.name)
    })
} 