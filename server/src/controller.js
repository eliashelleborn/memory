import httpStatus from 'http-status'

export const games = [
  {
    id: 1,
    status: 'lobby',
    settings: {
      password: '',
      pairs: 10,
      maxPlayers: 2
    },
    players: [
      {
        name: 'Elias',
        stats: {
          pairsCompleted: 0,
          clicks: 0
        }
      }
    ]
  }
]

const controller = {
  /**
   * * /api/browse?search=[value]
   */

  list (req, res) {
    /* try {
      let users
      if (req.query.search) {
        users = await User
          .find({
            username:
              { $regex: new RegExp(`.*${req.query.search}.*`, 'i') }
          })
          .exec()
      } else {
        users = await User.find().exec()
      }
      return res.json(users)
    } catch (err) {
      res.status(httpStatus.NOT_FOUND)
      return res.json({ message: 'No users found.' })
    } */
    return res.json(games)
  }
}

export default controller
