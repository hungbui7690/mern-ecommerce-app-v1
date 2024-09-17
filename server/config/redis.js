import Redis from 'ioredis'
import dotenv from 'dotenv'
dotenv.config()

const redisClient = new Redis(
  `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
)

export default redisClient
