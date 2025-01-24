import * as fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx/xlsx';
/*
import { promisify } from 'util';
const lockfile = require('lockfile');
const lockAsync = promisify(lockfile.lock);
const unlockAsync = promisify(lockfile.unlock);
*/
import { authADUser } from '@/utils/loginAD.js'
import { docSQLConfig } from '@/db/mssql'
import { DBGet } from '@/db/pool-manager.js'
import { NextResponse } from 'next/server'
import createToken from '@/utils/createToken.js'

export async function POST(request) {
    try {
        let { username, password, loginTime } = await request.json()
        console.log(username, password, loginTime);

        const auth_result = await authADUser(username, password)
        const docConnection = await DBGet('doc', docSQLConfig)
        const docQueryResult = await docConnection.query`select * from doc.doc_user where 1=1 and user_id=${username}`
        console.log(docQueryResult);
        if (auth_result) {

            const logFilePath = path.join(process.cwd(), 'src', 'data', 'login_log.xlsx');
            const logDir = path.dirname(logFilePath);

            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }

            console.log(logFilePath);

            // 加入檔案鎖機制
            //await lockAsync(logFilePath + '.lock', { retries: 5 });

            // 如果檔案不存在，創建一個新檔案
            let workbook;
            if (!fs.existsSync(logFilePath)) {
                workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet([]);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Log');
            } else {
                // 如果檔案存在，讀取現有檔案
                const fileBuffer = fs.readFileSync(logFilePath);
                workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            }

            const sheetName = 'Log';
            const worksheet = workbook.Sheets[sheetName] || XLSX.utils.json_to_sheet([]);

            // 將新記錄追加到現有資料中
            const existingData = XLSX.utils.sheet_to_json(worksheet);
            const newData = [...existingData, { Username: username, LoginTime: loginTime }];
            const newWorksheet = XLSX.utils.json_to_sheet(newData);

            // 替換原有工作表
            workbook.Sheets[sheetName] = newWorksheet;

            // 將檔案寫回
            await XLSX.writeFile(workbook, logFilePath);

            //await unlockAsync(logFilePath + '.lock');

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
        console.log(err);
        return NextResponse.json({
            auth_result: false
        }, { status: 403 })
    }
}