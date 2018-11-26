import dotenv from 'dotenv'
dotenv.config()

export let env = process.env.NODE_ENV
export let port = process.env.PORT
export let mongoUri = process.env.MONGO_URI
export let jwtSecret = process.env.JWT_SECRET
