import verifyToken from '@/utils/verifyToken'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const decoded = await verifyToken(request.cookies.get('jwt_token').value)
        console.log(`User verified: ${decoded.username}`)
        return NextResponse.json({valid: true, username: decoded.username}, {status: 200})
    } catch (err) {
        console.log(err)
        return NextResponse.json({valid: false, username: ''}, {status: 403})
    }
}