import SocketIO from 'socket.io'
import { games } from './controller'

const getGame = id => {
  const gameIndex = games.findIndex(game => game.id === id)

  return {
    game: games[gameIndex],
    gameIndex
  }
}

const getPlayer = socket => {
  const { game } = getGame(socket.currentGame)
  const playerIndex = game.players.findIndex(player => player.id === socket.id)

  return {
    player: game.players[playerIndex],
    playerIndex
  }
}

const initEvents = server => {
  const io = new SocketIO(server)

  io.on('connection', socket => {
    socket.on('join-room', data => {
      const { game, gameIndex } = getGame(data.room)

      // If game exists
      if (gameIndex >= 0) {
        if (game.players.length >= game.settings.maxPlayers) {
          socket.emit('room-full')
        } else {
          // Join room if game isnt full
          socket.join(data.room)
          socket.currentGame = game.id

          const newPlayer = {
            id: socket.id,
            name: data.user.name,
            status: 'waiting',
            stats: {
              pairsCompleted: 0,
              clicks: 0
            }
          }
          game.players.push(newPlayer)

          socket.emit('room-joined', game)
          socket.broadcast.to(data.room).emit('player-joined', newPlayer)
        }
      } else {
        socket.emit('room-not-found')
      }
    })

    socket.on('player-ready', () => {
      const { game } = getGame(socket.currentGame)
      const { player } = getPlayer(socket)
      player.status = 'ready'
      socket.broadcast.to(game.id).emit('player-ready', player)

      // Start countdown when game is full and all players are ready
      const playersReady = game.players.every(p => p.status === 'ready')
      if (game.players.length === game.settings.maxPlayers && playersReady) {
        let time = 10
        game.status = 'starting'
        game.interval = setInterval(() => {
          io.to(game.id).emit('countdown', time)
          if (time === 0) {
            clearInterval(game.interval)
            io.to(game.id).emit('game-started')
            game.status = 'started'
          }
          time--
        }, 1000)
      }
    })

    socket.on('disconnect', () => {
      if (socket.currentGame) {
        const { game } = getGame(socket.currentGame)
        const { player, playerIndex } = getPlayer(socket)

        // Remove player and clear game interval
        game.players.splice(playerIndex, 1)
        clearInterval(game.interval)
        game.status = 'lobby'

        socket.broadcast
          .to(socket.currentGame)
          .emit('player-disconnected', player.id)
      }
    })
  })
}

export default initEvents
