import mongoose from 'mongoose'
import { mongoUri } from './dotenv'

mongoose.Promise = Promise

export default {
  connect () {
    mongoose.connect(mongoUri, {
      useMongoClient: true
    })
    return mongoose.connection
  }
}
