import express from 'express'
import controller from '../controllers/user.controller'
import passport from 'passport'

const router = express.Router()

const protectedRoute = passport.authenticate('jwt', { session: false })

router.route('/')
  .get(protectedRoute, controller.list)

router.route('/me')
  .get(protectedRoute, controller.me)

router.route('/:userId')
  .get(protectedRoute, controller.getById)

export default router
