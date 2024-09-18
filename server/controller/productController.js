import { redisClient, cloudinary } from '../config/index.js'
import Product from '../model/Product.js'
import { NotFoundError, BadRequestError } from '../errors/index.js'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'

export const createProduct = async (req, res) => {
  const { name, description, price, category, isFeatured } = req.body
  let image = req.files?.image.tempFilePath

  if (!image) throw new BadRequestError('Image is required')

  if (image) {
    const uploadedResponse = await cloudinary.uploader.upload(image, {
      folder: 'products',
    })
    fs.unlinkSync(image)
    image = uploadedResponse.secure_url
  }

  const product = await Product.create({
    name,
    description,
    price,
    image,
    category,
    isFeatured: isFeatured || false,
  })

  res.status(StatusCodes.CREATED).json(product)
}

export const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.json({ products })
}

export const getFeaturedProducts = async (req, res) => {
  // Get featured products from redis if available
  let featuredProducts = await redisClient.get('featured_products')
  if (featuredProducts) return res.json(featuredProducts)

  // Fetch products from mongodb if not available in redis
  featuredProducts = await Product.find({ isFeatured: true }).lean() // .lean() is gonna return a plain javascript object instead of a mongodb document -> more performant
  if (!featuredProducts) throw new NotFoundError('No featured products found')

  // store in redis for future quick access
  await redisClient.set('featured_products', JSON.stringify(featuredProducts))

  res.json(featuredProducts)
}

export const deleteProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)

  if (!product) throw new NotFoundError('Product not found')

  if (product.image) {
    const publicId = product.image.split('/').pop().split('.')[0]
    await cloudinary.uploader.destroy(`products/${publicId}`)
  }

  await Product.findByIdAndDelete(id)

  res.json({ message: 'Product deleted successfully' })
}

export const getRecommendedProducts = async (req, res) => {
  // const { category } = req.params

  const products = await Product.aggregate([
    // {
    //   $match: { category }, // $match is used to filter documents -> category: category -> get products of the same category
    // },
    {
      $sample: { size: 4 }, // $sample is used to get random documents from the collection -> size: 4 -> get 4 random products
    },
    {
      // $project is used to include or exclude fields from the output -> include only the following fields
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        price: 1,
      },
    },
  ])

  res.json(products)
}

export const getProductsByCategory = async (req, res) => {
  // {{URL}}/product/category/make%20up -> space will be converted to %20
  const { category } = req.params

  const products = await Product.find({ category })
  res.json({ products })
}

export const toggleFeaturedProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) throw new NotFoundError('Product not found')

  product.isFeatured = !product.isFeatured
  const updatedProduct = await product.save()
  await updateFeaturedProductsCache()
  res.json(updatedProduct)
}

async function updateFeaturedProductsCache() {
  const featuredProducts = await Product.find({ isFeatured: true }).lean()
  await redisClient.set('featured_products', JSON.stringify(featuredProducts))
}
