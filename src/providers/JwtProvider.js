import JWT from 'jsonwebtoken'
/*
    function tạo mới 1 token - cần 3 tham số đầu vào 
    userInfo: Những thông tin muốn đính kèm vào token 
    sercretSignature: Chữ ký bí mật để tạo token
    tokenLife: Thời gian sống của token

*/ 
const generateAccessToken = async(userInfo, sercretSignature, tokenLife) => {
    try {

        return JWT.sign(userInfo, sercretSignature, {algorithm: 'SHA256',expiresIn: tokenLife})
    }
    catch (error) {
        throw new Error(error)
    }
}

const verifyAccessToken = async(token, sercretSignature ) => {
    try {
        return JWT.verify(token, sercretSignature)
    } catch (error) {
        throw new Error(error)
    }

    
}

export const JwtProvider = {    
    generateToken,
    verifyToken,
}