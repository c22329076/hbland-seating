import { NextResponse } from 'next/server'

export  async function GET(request) {
    const res = NextResponse.json({})
    res.cookies.set({
        name: 'jwt_token',
        value: '',
        maxAge: -1,
        httpOnly: true,
        sameSite: 'strict'
    })
    return res
}