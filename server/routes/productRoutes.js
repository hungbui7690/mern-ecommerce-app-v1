import express from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from '../controller/productController.js'
import { adminRoute, authenticateUser } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authenticateUser, adminRoute, createProduct)
router.get('/', authenticateUser, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/recommended', getRecommendedProducts)
router.patch('/:id', authenticateUser, adminRoute, toggleFeaturedProduct)
router.delete('/:id', authenticateUser, adminRoute, deleteProduct)

export default router
