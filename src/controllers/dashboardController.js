import { StatusCodes } from 'http-status-codes'

const access = async (req, res) => {
  try {
    const userInfo = {
      id: req.JWTDecoded.id,
      email: req.JWTDecoded.email
    }
    res.status(StatusCodes.OK).json(userInfo)
  } catch (error) {
    console.error('Error in dashboardController.access:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error })
  }
}

export const dashboardController = {
  access
}