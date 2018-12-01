import httpStatus from 'http-status'

export const games = [
  {
    id: '1',
    status: 'lobby',
    startTime: null,
    interval: null,
    settings: {
      password: '',
      pairs: 10,
      maxPlayers: 2
    },
    board: [],
    players: [
      /* {
        name: 'Elias',
        stats: {
          pairsCompleted: 0,
          clicks: 0
        }
      } */
    ]
  },
  {
    id: '2',
    status: 'lobby',
    startTime: null,
    interval: null,
    settings: {
      password: '',
      pairs: 10,
      maxPlayers: 2
    },
    board: [],
    players: [
      /* {
        name: 'Elias',
        stats: {
          pairsCompleted: 0,
          clicks: 0
        }
      } */
    ]
  }
]

const controller = {
  /**
   * * /api/browse?search=[value]
   */
  list (req, res) {
    return res.json(games)
  },

  create (req, res) {
    const { name, password, pairs, maxPlayers } = req.body

    if (!name) {
      res.status(httpStatus.BAD_REQUEST)
      return res.json({ message: 'No username given' })
    }

    const newGame = {
      id: Math.random(),
      status: 'lobby',
      settings: {
        password: password || '',
        pairs: pairs || 10,
        maxPlayers: maxPlayers || 2
      },
      players: [
        {
          name: name,
          stats: {
            pairsCompleted: 0,
            clicks: 0
          }
        }
      ]
    }

    games.push(newGame)

    res.status(httpStatus.OK)
    return res.json(newGame)
  }
}

export default controller
