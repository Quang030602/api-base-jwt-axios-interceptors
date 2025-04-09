import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { JwtProvider, 
  ACCESS_TOKEN_SECRET_SIGNATURE, 
  REFRESH_TOKEN_SECRET_SIGNATURE,
  
} 
  from '~/providers/JwtProvider'
const MOCK_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
  MODERATOR: 'moderator',
}
const MOCK_DATABASE = {
  USER: {
    ID: 'aimier-sample-id-12345678',
    EMAIL: 'minhquang030602@gmail.com',
    PASSWORD: '030602',
    ROLE: MOCK_ROLES.ADMIN,
  }
}

const login = async (req, res) => {
  try {
    if (req.body.email !== MOCK_DATABASE.USER.EMAIL || req.body.password !== MOCK_DATABASE.USER.PASSWORD) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL,
      role: MOCK_DATABASE.USER.ROLE
    }
    // tạo ra 2 loại token , accessToken và refreshToken
    const accessToken = await JwtProvider.generateToken(
      userInfo, 
      ACCESS_TOKEN_SECRET_SIGNATURE, 
      '1h',
    )
    const refreshToken = await JwtProvider.generateToken(
      userInfo, 
      REFRESH_TOKEN_SECRET_SIGNATURE , 
      '14 days',
    )
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('1h')
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', 
      maxAge: ms('14d')
    })
    // trả về thông tin user cũng như sẽ trả về Tokens cho trường hợp phía FE cần lưu Tokens vào storage
    return res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    // Do something
    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies?.refreshToken  
    const refreshTokenFromBody= req.body?.refreshToken 
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshTokenFromCookie,
      refreshTokenFromBody, 
      REFRESH_TOKEN_SECRET_SIGNATURE,
    )
    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
      role: refreshTokenDecoded.role
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo, 
      ACCESS_TOKEN_SECRET_SIGNATURE, 
      '1h',
    )

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('1h')
    })
    
    res.status(StatusCodes.OK).json({ message: ' Refresh Token API success.' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
