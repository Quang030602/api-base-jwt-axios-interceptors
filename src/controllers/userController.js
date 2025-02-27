import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { JwtProvider, 
  ACCESS_TOKEN_SECRET_SIGNATURE, 
  REFRESH_TOKEN_SECRET_SIGNATURE } 
  from '~/providers/JwtProvider'
/**
 * Mock nhanh thông tin user thay vì phải tạo Database rồi query.
 */
const MOCK_DATABASE = {
  USER: {
    ID: 'aimier-sample-id-12345678',
    EMAIL: 'minhquang030602@gmail.com',
    PASSWORD: 'Quang030602'
  }
}

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 * làm Demo thôi nên mới đặt biến const và giá trị random ngẫu nhiên trong code nhé.
 * Xem thêm về biến môi trường: https://youtu.be/Vgr3MWb7aOw
 */
const ACCESS_TOKEN_SECRET_SIGNATURE = 'KBgJwUETt4HeVD05WaXXI9V3JnwCVP'
const REFRESH_TOKEN_SECRET_SIGNATURE = 'fcCjhnpeopVn2Hg1jG75MUi62051yL'

const login = async (req, res) => {
  try {
    if (req.body.email !== MOCK_DATABASE.USER.EMAIL || req.body.password !== MOCK_DATABASE.USER.PASSWORD) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
      return
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL,
    }
    // tạo ra 2 loại token , accessToken và refreshToken
    const accessToken = await JwtProvider.generateAccessToken(
      userInfo, 
      ACCESS_TOKEN_SECRET_SIGNATURE, 
      '1h',
    )
    const refreshToken = await JwtProvider.generateAccessToken(
      userInfo, 
      REFRESH_TOKEN_SECRET_SIGNATURE , 
      '14 days',
    )
    res.cookie('accessToken',accessToken,{
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('1h')
    })

    res.cookie('refreshToken',refreshToken,{
      httpOnly: true,
      secure: true,
      sameSite: 'none', 
      maxAge: ms('1h')
    })
// trả về thông tin user cũng như sẽ trả về Tokens cho trường hợp phía FE cần lưu Tokens vào stroage
    res.status(StatusCodes.OK).json(
      { 
        ...userInfo, 
        accessToken, 
        refreshToken 
      })

    res.status(StatusCodes.OK).json({ message: 'Login API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Do something
    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Do something
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
