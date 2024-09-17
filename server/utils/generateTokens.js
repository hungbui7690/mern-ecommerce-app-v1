import jwt from 'jsonwebtoken'
import { redisClient } from '../config/index.js'

export const setTokensCookies = async ({ res, userId }) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    }
  )

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  )

  // Expiration -> EX -> https://github.com/upstash/redis-js
  await redisClient.set(
    `refresh_token:${userId}`,
    refreshToken,
    { ex: 7 * 24 * 60 * 60 } // 7days
  )

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}
