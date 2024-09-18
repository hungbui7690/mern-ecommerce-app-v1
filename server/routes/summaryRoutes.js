import express from 'express'
import { adminRoute, authenticateUser } from '../middleware/authMiddleware.js'
import {
  getSummaryData,
  getDailySummaryData,
} from '../controller/summaryController.js'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

router.get('/', authenticateUser, adminRoute, async (req, res) => {
  const summaryData = await getSummaryData()

  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days

  const dailySummaryData = await getDailySummaryData(startDate, endDate)

  res.status(StatusCodes.OK).json({
    summaryData,
    dailySummaryData,
  })
})

export default router
