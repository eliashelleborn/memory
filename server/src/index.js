import http from 'http'
import app from './config/express'
/* import mongoose from './config/mongoose' */
import initEvents from './events'

export const server = http.Server(app)

initEvents(server)

server.listen(3030, () => {
  console.log(`Server started on http://localhost:${3030}`)
  /* mongoose.connect() */
})
