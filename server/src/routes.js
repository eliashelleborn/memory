import express from 'express'
import httpStatus from 'http-status'
import controller from './controller'

const router = express.Router()

router.route('/games').get(controller.list)

export default router
