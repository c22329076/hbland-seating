const jwt = require('jsonwebtoken')

export default async function createToken(payload) {
    let jwtSignPromise = new Promise((resolve, reject) => {
        const maxAge = 3 * 60 * 60 // 3hr (seconds)
        jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: maxAge}, (err, token) => {
            if (err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })
    return jwtSignPromise
}