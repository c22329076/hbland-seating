import { authADUser } from '@/utils/loginAD.js'
import { docSQLConfig } from '@/db/mssql'
import { DBGet } from '@/db/pool-manager.js'
import { NextResponse } from 'next/server'
import createToken from '@/utils/createToken.js'

export async function POST(request) {
    try {
        let { username, password } = await request.json()
        console.log(username, password)
        const auth_result = await authADUser(username, password)
        const docConnection = await DBGet('doc', docSQLConfig)
        const docQueryResult = await docConnection.query`select * from doc.doc_user where 1=1 and user_id=${username}`
        console.log(docQueryResult)
        if (auth_result) {
            const docConnection = await DBGet('doc', docSQLConfig)
            const docQueryResult = await docConnection.query`select user_job_id from doc.Doc_User where user_id=${username}`
            // 助理管理師 user_job_id: '2A'
            // 課長 user_job_id: '13'
            if (docQueryResult.recordset) {
                const isManager = (docQueryResult.recordset[0].user_job_id === '13')
                const jwt_token = await createToken({ username, isManager })
                const maxAge = 3 * 60 * 60 // 3 hr
                const res = NextResponse.json({
                    auth_result,
                    isManager
                }, { status: 200 })
                res.cookies.set({
                    name: 'jwt_token',
                    value: jwt_token,
                    maxAge: maxAge,
                    httpOnly: true,
                    sameSite: 'strict'
                })
                return res
            }
        }
        const res = NextResponse.json({
            auth_result
        }, { status: 200 })
        return res
    } catch (err) {
        console.log(err)
        return NextResponse.json({
            auth_result: false
        }, { status: 403 })
    }
}