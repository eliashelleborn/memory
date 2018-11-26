import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import passport from 'passport'
import routes from '../routes'
import './passport'

Promise = require('bluebird') // eslint-disable-line no-global-assign

// Express Instance
const app = express()

// Plugins
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(passport.initialize())

// API Routes
app.use('/api', routes)

export default app
