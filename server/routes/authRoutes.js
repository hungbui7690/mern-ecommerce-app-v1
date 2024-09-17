import express from 'express'
import {
  login,
  signup,
  logout,
  refreshToken,
  getProfile,
} from '../controller/authController.js'
import { authenticateUser } from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.get('/profile', authenticateUser, getProfile)

export default router
