const { DBGet } = require('../db/pool-manager.js')
const { docSQLConfig } = require("../db/mssql.js")

const checkManagerID = async (user_id) => {
    let manager_id = null
    const docConnection = await DBGet('doc', docSQLConfig)
    const docQueryResult = await docConnection.query`select user_id from doc.doc_user where unit_id=(select unit_id from doc.doc_user where user_id=${user_id}) and user_job_id='13' and now_job='Y' order by user_id`
    
    if (docQueryResult.recordset) {
        // console.log('checkManagerID docQueryResult', docQueryResult)
        manager_id = docQueryResult.recordset[0].user_id
    }
    return manager_id
}

module.exports = checkManagerID