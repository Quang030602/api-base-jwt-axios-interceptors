/* eslint-disable no-console */


import { StatusCodes } from 'http-status-codes'
import { JwtProvider, ACCESS_TOKEN_SECRET_SIGNATURE } from '~/providers/JwtProvider'


const isAuthorized = async (req, res, next) => {
    // c1: lấy accessToken và refreshToken từ cookie
    const accessTokenFromCookie = req.cookies?.accessToken
    if (!accessTokenFromCookie) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access Token is required.' })
    }
    // c2: lấy accessToken và refreshToken từ header
    // const accessTokenFromHeader = req.headers.Authorization
    // const refreshTokenFromHeader = req.headers
    try {
        // B1: Giải mã token xem nó có hợp lệ không
        const accessTokenDecoded = await JwtProvider.verifyToken(
            accessTokenFromCookie, 
            ACCESS_TOKEN_SECRET_SIGNATURE,            
        )
        // B2: Nếu Token hợp lệ thì sẽ cần lưu thông tin giải mã được 
        // vào cái req.JWTDecoded để sử dụng cho các tầng các xử lý phía sau
        req.JWTDecoded = accessTokenDecoded
        // B3: cho phép cái req đi tiếp
        next()
    } catch (error) {
        console.log('error from authMiddleware', error)
        if (error.message?.includes('jwt expired')) {
            return res.status(StatusCodes.GONE).json({ message: 'Access Token is expired.' })
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access Token is required.' })
    }
}


export const authMiddleware = { 
    isAuthorized,
}