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
        if (game.status === 'lobby') {
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
                clicks: 0,
                time: null
              }
            }
            game.players.push(newPlayer)

            socket.emit('room-joined', game)
            socket.broadcast.to(data.room).emit('player-joined', newPlayer)
          }
        } else {
          socket.emit('room-already-started')
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
        prepareGame(io, socket, game)
      }
    })

    socket.on('disconnect', () => {
      if (socket.currentGame) {
        const { game, gameIndex } = getGame(socket.currentGame)
        const { player, playerIndex } = getPlayer(socket)

        if (game.status === 'starting') {
          // Remove player and clear game interval
          clearInterval(game.interval)
          game.status = 'lobby'
        }

        if (game.players.length === 0) {
          games.splice(gameIndex, 1)
        }

        game.players.splice(playerIndex, 1)
        socket.broadcast
          .to(socket.currentGame)
          .emit('player-disconnected', player.id)
      }
    })

    // Game Actions
    socket.on('player-clicked', () => {
      const { player } = getPlayer(socket)
      player.stats.clicks++
      socket.broadcast.to(socket.currentGame).emit('player-clicked', {
        player: player.id,
        clicks: player.stats.clicks
      })
    })
    socket.on('player-completed-pair', () => {
      const { player } = getPlayer(socket)
      player.stats.pairsCompleted++
      socket.broadcast.to(socket.currentGame).emit('player-completed-pair', {
        player: player.id,
        pairsCompleted: player.stats.pairsCompleted
      })
    })
    socket.on('player-finished', () => {
      const { game, gameIndex } = getGame(socket.currentGame)
      const { player } = getPlayer(socket)
      player.stats.time = Date.now() - game.startTime
      game.placements.push(player.id)
      io.to(socket.currentGame).emit('player-finished', {
        placement: game.placements.indexOf(player.id),
        player
      })

      if (game.placements.length === game.players.length) {
        io.to(socket.currentGame).emit('game-ended')
      }
    })
  })
}

const prepareGame = (io, socket, game) => {
  const board = createBoard(game.settings.pairs)
  game.board = board
  io.to(game.id).emit('game-setup', game)

  let time = 3
  game.status = 'starting'
  game.interval = setInterval(() => {
    io.to(game.id).emit('countdown', time)
    if (time === 0) {
      clearInterval(game.interval)
      game.status = 'started'
      game.startTime = Date.now()
      io.to(game.id).emit('game-started', game)
    }
    time--
  }, 1000)
}

const createBoard = pairCount => {
  const cards = Array.from(Array(pairCount).keys())
  const board = [...cards, ...cards]
  board.sort(() => Math.random() - 0.5)
  return board
}

export default initEvents
