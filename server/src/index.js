import http from 'http'
import app from './config/express'
import { port } from './config/dotenv'
/* import mongoose from './config/mongoose' */
import SocketIO from 'socket.io'

export const server = http.Server(app)
export const io = new SocketIO(server)

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
  /* mongoose.connect() */
})
