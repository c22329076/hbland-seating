const jwt = require('jsonwebtoken')
require('dotenv').config()

export default async function verifyToken(jwt_token) {
    const jwtVerifyPromise = new Promise((resolve, reject) => {
        jwt.verify(jwt_token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        })
    })
    return jwtVerifyPromise
}