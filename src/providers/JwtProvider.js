import JWT from 'jsonwebtoken'
/*
    function tạo mới 1 token - cần 3 tham số đầu vào 
    userInfo: Những thông tin muốn đính kèm vào token 
    sercretSignature: Chữ ký bí mật để tạo token
    tokenLife: Thời gian sống của token

*/ 
const generateToken = async(userInfo, sercretSignature, tokenLife) => {
    try {

        return JWT.sign(userInfo, sercretSignature, {algorithm: 'HS256',expiresIn: tokenLife})
    }
    catch (error) {
        throw new Error(error)
    }
}

const verifyToken = async(token, sercretSignature ) => {
    try {
        return JWT.verify(token, sercretSignature)
    } catch (error) {
        throw new Error(error)
    }    
}
export const ACCESS_TOKEN_SECRET_SIGNATURE = 'KBgJwUETt4HeVD05WaXXI9V3JnwCVP'
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'fcCjhnpeopVn2Hg1jG75MUi62051yL'

export const JwtProvider = {    
    generateToken,
    verifyToken,
    ACCESS_TOKEN_SECRET_SIGNATURE,
    REFRESH_TOKEN_SECRET_SIGNATURE
}