import { StatusCodes } from 'http-status-codes'
import Coupon from '../model/Coupon.js'
import { BadRequestError, NotFoundError } from '../errors/index.js'

export const getCoupon = async (req, res) => {
  const coupon = await Coupon.findOne({
    userId: req.user._id,
    isActive: true,
  })
  res.status(StatusCodes.OK).json(coupon || { message: 'No coupon found' })
}

export const validateCoupon = async (req, res) => {
  // Get the coupon code from the request body
  const { code } = req.body

  // If no coupon code is provided, throw an error
  if (!code) {
    throw new BadRequestError('Please provide a coupon code')
  }

  // Find the coupon in the database
  const coupon = await Coupon.findOne({
    code,
    userId: req.user._id,
    isActive: true,
  })

  if (!coupon) {
    throw new NotFoundError('Coupon not found')
  }

  // Check if the coupon has expired
  if (coupon.expirationDate < new Date()) {
    // If the coupon has expired, set isActive to false and save the coupon
    coupon.isActive = false
    await coupon.save()
    throw new NotFoundError('Coupon has expired')
  }

  // If the coupon is valid, return the coupon code and discount percentage
  res.json({
    message: 'Coupon is valid',
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
  })
}
