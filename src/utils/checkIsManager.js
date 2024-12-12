const { DBGet } = require('../db/pool-manager.js')
const { docSQLConfig } = require('../db/mssql')


async function checkIsManager(user_id) {
    let isManager = false
    const docConnection = await DBGet('doc', docSQLConfig)
//    let isManagerQuery = await docConnection.query`select user_job_id from doc.doc_user where 1=1 and user_id=${user_id}`
//    if (isManagerQuery.recordset) {
//        const user_job_id = isManagerQuery.recordset[0].user_job_id
//        let isManagerQuery = await docConnection.query`select user1_id from doc.doc_user where 1=1 and user_id=${user_id}`
//        if (isManagerQuery.recordset) {
//            const user1_id = isManagerQuery.recordset[0].user1_id
            if (user_id === 'HB10069353') {
                isManager = true
            }
    return isManager
}

module.exports = checkIsManager