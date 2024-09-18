import express from 'express'
import { authenticateUser } from '../middleware/authMiddleware.js'
import { getCoupon, validateCoupon } from '../controller/couponController.js'

const router = express.Router()

router.get('/', authenticateUser, getCoupon)
router.post('/validate', authenticateUser, validateCoupon)

export default router
