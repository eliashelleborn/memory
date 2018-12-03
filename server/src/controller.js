import httpStatus from 'http-status'

export const games = [
  /* {
    id: '1',
    name: 'Test game 1',
    status: 'lobby',
    startTime: null,
    interval: null,
    settings: {
      password: '',
      pairs: 2,
      maxPlayers: 2
    },
    board: [],
    placements: [],
    players: []
  }, */
]

function makeid () {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

const controller = {
  /**
   * * /api/browse?search=[value]
   */
  list (req, res) {
    const availableGames = games.filter(game => game.status === 'lobby')
    return res.json(availableGames)
  },

  create (req, res) {
    const { name, password, pairs, maxPlayers } = req.body

    const id = makeid()
    const newGame = {
      id: id,
      name: name || id,
      status: 'lobby',
      startTime: null,
      interval: null,
      settings: {
        password: password || '',
        pairs: pairs || 10,
        maxPlayers: maxPlayers || 2
      },
      players: [],
      placements: [],
      board: []
    }

    games.push(newGame)

    res.status(httpStatus.OK)
    return res.json(newGame)
  }
}

export default controller
