import { BadRequestError, NotFoundError } from '../errors/index.js'
import Product from '../model/Product.js'

export const addToCart = async (req, res) => {
  const { productId } = req.body
  const user = req.user

  const existingItem = user.cartItems.find((item) => item.id === productId)
  if (existingItem) existingItem.quantity += 1
  else user.cartItems.push(productId)

  await user.save()
  res.json(user.cartItems)
}

export const getCartProducts = async (req, res) => {
  const products = await Product.find({ _id: { $in: req.user.cartItems } })

  // add quantity for each product
  const cartItems = products.map((product) => {
    const item = req.user.cartItems.find(
      (cartItem) => cartItem.id === product.id
    )
    return { ...product.toJSON(), quantity: item.quantity }
  })

  res.json(cartItems)
}

export const updateQuantity = async (req, res) => {
  const { id: productId } = req.params
  const { quantity } = req.body
  const user = req.user

  // find the product in the cart
  const existingItem = user.cartItems.find((item) => item.id === productId)

  // if the product is not in the cart, throw an error
  if (!existingItem) throw new NotFoundError('Product not found')

  // if the quantity is 0, remove the product from the cart
  if (quantity === 0) {
    user.cartItems = user.cartItems.filter((item) => item.id !== productId)
    await user.save()
    return res.json(user.cartItems)
  }

  // update the quantity of the product
  existingItem.quantity = quantity
  await user.save()
  res.json(user.cartItems)
}

export const removeItem = async (req, res) => {
  const { id: productId } = req.params

  if (!productId) throw new BadRequestError('Please provide a product id')

  const user = req.user
  user.cartItems = user.cartItems.filter((item) => item.id !== productId)

  await user.save()
  res.json(user.cartItems)
}

export const removeAllItems = async (req, res) => {
  const user = req.user

  user.cartItems = []
  await user.save()

  res.json(user.cartItems)
}
