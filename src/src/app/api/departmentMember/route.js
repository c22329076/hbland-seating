import { tdocSQLConfig } from '@/db/mssql'
import { DBGet } from '@/db/pool-manager.js'
import verifyToken from '@/utils/verifyToken'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const decoded_token = await verifyToken(request.cookies.get('jwt_token').value)
        const user_id = decoded_token.username
        const tdocConnection = await DBGet('tdoc', tdocSQLConfig)
        const apUnitIDQuery = await tdocConnection.query`select AP_UNIT_ID from tdoc.AP_USER where DocUserID=${user_id}`
        const apUnitID = apUnitIDQuery.recordset[0].AP_UNIT_ID
        const apDepartmentMemberQuery = await tdocConnection.query`select DocUserId, AP_USER_NAME from tdoc.AP_USER where AP_UNIT_ID=${apUnitID} and ap_off_job='N'`
        let departmentMember = apDepartmentMemberQuery.recordset
        departmentMember = departmentMember.map(member => { return { user_id: member.DocUserId, username: member.AP_USER_NAME } })
        departmentMember = departmentMember.filter(member => member.user_id !== user_id)

        return NextResponse.json({ departmentMember }, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 400 })
    }
}