import httpStatus from 'http-status'
import User from '../models/user.model'
import { extractTokenPayload } from '../config/passport'

const controller = {

  /**
   * * /api/users/:userId
   */

  async getById (req, res) {
    try {
      const user = await User.get(req.params.userId)
      return res.json(user)
    } catch (err) {
      res.status(httpStatus.NOT_FOUND).json('No user found.')
    }
  },

  /**
   * * /api/users/me
   */

  async me (req, res) {
    const { authorization } = req.headers
    const payload = extractTokenPayload(authorization)
    const user = await User.get(payload)
    return res.send(user)
  },

  /**
   * * /api/users?search=[value]
   */

  async list (req, res) {
    try {
      let users
      if (req.query.search) {
        /* --- SEARCH --- */
        users = await User
          .find({
            username:
              { $regex: new RegExp(`.*${req.query.search}.*`, 'i') }
          })
          .exec()
        /* -------------- */
      } else {
        users = await User.find().exec()
      }
      return res.json(users)
    } catch (err) {
      res.status(httpStatus.NOT_FOUND)
      return res.json({ message: 'No users found.' })
    }
  }
}

export default controller
