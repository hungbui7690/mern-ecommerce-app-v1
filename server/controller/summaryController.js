import Order from '../model/Order.js'
import Product from '../model/Product.js'
import User from '../model/User.js'

export const getSummaryData = async () => {
  const totalUsers = await User.countDocuments()
  const totalProducts = await Product.countDocuments()

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // it groups all documents together,
        totalSales: { $sum: 1 }, // count number of documents
        totalRevenue: { $sum: '$totalAmount' },
      },
    },
  ])

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  }

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  }
}

export const getDailySummaryData = async (startDate, endDate) => {
  const dailySalesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, // group by createdAt
        sales: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  // example result
  // [
  // 	{
  // 		_id: "2024-08-18",
  // 		sales: 12,
  // 		revenue: 1450.75
  // 	},
  // ]

  const dateArray = getDatesInRange(startDate, endDate)
  // console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]

  return dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date)

    return {
      date,
      sales: foundData?.sales || 0,
      revenue: foundData?.revenue || 0,
    }
  })
}

function getDatesInRange(startDate, endDate) {
  const dates = []
  let currentDate = new Date(startDate) // 05 October 2011 14:48 UTC

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]) // ISO String: 2011-10-05T14:48:00.000Z
    currentDate.setDate(currentDate.getDate() + 1) // 5 + 1 = 6
  }

  return dates
}
