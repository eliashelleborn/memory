import SocketIO from 'socket.io'
import { games } from './controller'

const initEvents = server => {
  const io = new SocketIO(server)

  io.on('connection', socket => {
    socket.on('join-room', data => {
      const i = games.findIndex(game => game.id === parseInt(data.room))
      const game = games[i]

      // If game exists
      if (i >= 0) {
        if (game.players.length >= game.settings.maxPlayers) {
          socket.emit('room-full')
        } else {
          // Join room if game isnt full
          socket.join(data.room)
          socket.currentGame = game.id

          const newPlayer = {
            id: socket.id,
            name: data.user.name,
            stats: {
              pairsCompleted: 0,
              clicks: 0
            }
          }
          game.players.push(newPlayer)

          socket.emit('room-joined', game)
          socket.broadcast.to(data.room).emit('player-joined', game)

          // Start countdown whem game is full
          if (game.players.length === game.settings.maxPlayers) {
            let time = 15
            game.interval = setInterval(() => {
              io.to(data.room).emit('countdown', time)
              time-- || clearInterval(game.interval)
            }, 1000)
          }
        }
      } else {
        socket.emit('room-not-found')
      }
    })

    socket.on('pair-completed', () => {
      for (const roomIndex in socket.rooms) {
        if (socket.rooms.hasOwnProperty(roomIndex)) {
          const room = socket.rooms[roomIndex]
          socket.broadcast.to(room).emit('pair-completed')
        }
      }
    })

    socket.on('disconnect', () => {
      if (socket.currentGame) {
        const gameIndex = games.findIndex(
          game => game.id === socket.currentGame
        )
        const playerIndex = games[gameIndex].players.findIndex(
          player => player.id === socket.id
        )
        const game = games[gameIndex]

        // Remove player and clear game interval
        game.players.splice(playerIndex, 1)
        clearInterval(game.interval)

        socket.broadcast
          .to(socket.currentGame)
          .emit('player-disconnected', game)
      }
    })
  })
}

export default initEvents
