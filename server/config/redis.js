import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'
dotenv.config()

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_PASSWORD,
})

export default redisClient
