import express from 'express'
import { authenticateUser } from '../middleware/authMiddleware.js'
import {
  checkoutSuccess,
  createCheckoutSession,
} from '../controllers/payment.controller.js'

const router = express.Router()

router.post('/create-checkout-session', authenticateUser, createCheckoutSession)
router.post('/checkout-success', authenticateUser, checkoutSuccess)

export default router
