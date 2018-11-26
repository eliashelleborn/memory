import User from '../models/user.model'
import moment from 'moment-timezone'
import httpStatus from 'http-status'
import jwt from 'jwt-simple'
import { jwtSecret } from '../config/dotenv'

const controller = {

  /**
   * * /api/auth/register
   */

  register (req, res) {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })

    user.save((err, user) => {
      if (err) return res.status(httpStatus.BAD_REQUEST).json('Could not create user.')

      const token = jwt.encode(user._id, jwtSecret, 'HS256', {
        iat: moment().unix(),
        exp: moment().add(1, 'hours').unix()
      })

      return res.json({ user: user.transform(), token: token })
    })
  },

  /**
   * * /api/auth/login
   */

  async login (req, res) {
    const { password, email } = req.body
    try {
      const user = await User.findOne({ email: email }).select('+password').exec()
      if (await user.comparePasswords(password)) {
        return res.json({ token: createToken(user._id), user: user.transform() })
      } else {
        res.status(httpStatus.BAD_REQUEST)
        return res.json({ message: 'Passwords did not match.' })
      }
    } catch (err) {
      return res.json('No user with that email found.')
    }
  }
}

const createToken = userId => {
  const token = jwt.encode(userId, jwtSecret, 'HS256', {
    iat: moment().unix(),
    exp: moment().add(1, 'hours').unix()
  })
  return token
}

export default controller
