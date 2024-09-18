import User from '../model/User.js'
import jwt from 'jsonwebtoken'
import { setTokensCookies } from '../utils/generateTokens.js'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'
import { redisClient } from '../config/index.js'

// Login Workflow: Generate Access Token and Refresh Token -> Set Refresh Token in Redis -> Set Access Token and Refresh Token in Cookies
export const signup = async (req, res) => {
  const { email, password, name } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) throw new BadRequestError('User already exists')

  const user = await User.create({ name, email, password })

  // set first user as admin
  const countUser = await User.estimatedDocumentCount()
  if (countUser === 1) {
    user.role = 'admin'
    await user.save()
  }

  await setTokensCookies({ res, userId: user._id })

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.comparePassword(password))) {
    await setTokensCookies({ res, userId: user._id })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } else throw new BadRequestError('Invalid email or password')
}

// Logout Workflow: Delete Refresh Token from Redis -> Clear Access Token and Refresh Token Cookies
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    await redisClient.del(`refresh_token:${decoded.userId}`)
  }

  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out successfully' })
}

// Refresh Token Workflow: Verify Refresh Token -> Check if Refresh Token is in Redis -> Generate New Access Token -> Set New Access Token in Cookies
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) throw new UnauthenticatedError('No refresh token provided')

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
  const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`)

  if (storedToken !== refreshToken)
    throw new UnauthenticatedError('Invalid refresh token')

  const accessToken = jwt.sign(
    { userId: decoded.userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  })

  res.json({ message: 'Token refreshed successfully' })
}

export const getProfile = async (req, res) => {
  res.json(req.user)
}
