import SocketIO from 'socket.io'
import { games } from './controller'

const initEvents = server => {
  const io = new SocketIO(server)

  io.on('connection', socket => {
    socket.on('joinRoom', data => {
      const game = games.filter(game => game.id.toString() === data.room)
      if (game.length === 1) {
        socket.join(data.room)
        socket.broadcast
          .to(data.room)
          .emit('userJoined', data.user.name + ' joined the room')
      }
    })

    socket.on('pairCompleted', () => {
      for (const roomIndex in socket.rooms) {
        if (socket.rooms.hasOwnProperty(roomIndex)) {
          const room = socket.rooms[roomIndex]
          socket.broadcast.to(room).emit('pairCompleted')
        }
      }
    })

    socket.on('disconnect', () => {})
  })
}

export default initEvents
