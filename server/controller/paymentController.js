import Coupon from '../model/Coupon.js'
import Order from '../model/Order.js'
import { stripe } from '../lib/stripe.js'
import { BadRequestError } from '../errors/index.js'
import { StatusCodes } from 'http-status-codes'

// We will create an order when payment is successful

export const createCheckoutSession = async (req, res) => {
  const { products, couponCode } = req.body

  // check if products array is valid
  if (!Array.isArray(products) || products.length === 0)
    throw new BadRequestError('Please provide a valid products array')

  // total amount to create new coupon code later
  let totalAmount = 0

  // # stripe docs -> lineItems is required from stripe
  const lineItems = products.map((product) => {
    const amount = Math.round(product.price * 100) // required by stripe  -> convert from dollars to cents -> 100cents = $1
    totalAmount += amount * product.quantity

    // required by stripe -> return line item with format
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: amount,
      },
      quantity: product.quantity || 1,
    }
  })

  // apply coupon to total amount
  let coupon = null
  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode,
      userId: req.user._id,
      isActive: true,
    })
    if (coupon) {
      totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100)
    }
  }

  // create coupon is stripe system
  const stripeCoupon = await stripe.coupons.create({
    percent_off: coupon?.discountPercentage,
    duration: 'once',
  })

  // # stripe docs -> create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
    discounts: coupon
      ? [
          {
            coupon: stripeCoupon.id, // coupon id from stripe coupon that we created above
          },
        ]
      : [],
    // https://docs.stripe.com/metadata -> we can add additional info to metadata -> key: value pair
    metadata: {
      userId: req.user._id.toString(),
      couponCode: couponCode || '',
      products: JSON.stringify(
        products.map((p) => ({
          id: p._id,
          quantity: p.quantity,
          price: p.price,
        }))
      ),
    },
  })

  // if total amount is greater than 20,000, create a new coupon for the user
  if (totalAmount >= 20000) {
    await createNewCoupon(req.user._id)
  }

  res.status(StatusCodes.OK).json({
    id: session.id,
    totalAmount: totalAmount / 100,
  })
}

// Will call this route when payment is successful
export const checkoutSuccess = async (req, res) => {
  const { sessionId } = req.body
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status === 'paid') {
    if (session.metadata.couponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: session.metadata.couponCode,
          userId: session.metadata.userId,
        },
        {
          isActive: false,
        }
      )
    }

    // create a new Order after payment complete
    const products = JSON.parse(session.metadata.products)
    const newOrder = new Order({
      user: session.metadata.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: session.amount_total / 100, // convert from cents to dollars,
      stripeSessionId: sessionId,
    })

    await newOrder.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message:
        'Payment successful, order created, and coupon deactivated if used.',
      orderId: newOrder._id,
    })
  }
}

// create new coupon for user in our system
async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId })

  const newCoupon = new Coupon({
    code: 'GIFT' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  })

  await newCoupon.save()

  return newCoupon
}
