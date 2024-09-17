import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
    stack: err.stack,
    name: err.name || 'Custom Error',
  }
  console.log(customError)

  return res.status(customError.statusCode).json({
    success: false,
    name: customError.name,
    msg: customError.msg,
    statusCode: customError.statusCode,
    stack: customError.stack,
  })
}

export default errorHandlerMiddleware
