import { Strategy, ExtractJwt } from 'passport-jwt'
import jwt from 'jwt-simple'
import { jwtSecret } from './dotenv'
/* import User from '../models/user.model' */
import passport from 'passport'

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = jwtSecret

passport.use(
  new Strategy(opts, (jwtPayload, done) => {
    User.findOne({ id: jwtPayload._id }, (err, user) => {
      if (err) {
        return done(err, false)
      }
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    })
  })
)

export function extractTokenPayload (token) {
  token = token.split(' ')
  const payload = jwt.decode(token[1], jwtSecret)
  return payload
}
