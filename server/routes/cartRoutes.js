import express from 'express'
import {
  addToCart,
  getCartProducts,
  removeItem,
  removeAllItems,
  updateQuantity,
} from '../controller/cartController.js'
import { authenticateUser } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authenticateUser, addToCart)
router.get('/', authenticateUser, getCartProducts)
router.delete('/', authenticateUser, removeAllItems)
router.delete('/:id', authenticateUser, removeItem)
router.patch('/:id', authenticateUser, updateQuantity)

export default router
