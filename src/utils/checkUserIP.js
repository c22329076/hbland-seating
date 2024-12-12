const { DBGet } = require("../db/pool-manager.js");
const { tdocSQLConfig } = require("../db/mssql.js");

const checkUserIP = async (user_id) => {
    const tdocConnection = await DBGet('tdoc', tdocSQLConfig)
    const userIPQueryResult = await tdocConnection.query`select AP_PCIP from tdoc.ap_user where DocUserID=${user_id} and ap_off_job=${'N'}`
    if (userIPQueryResult.recordset) {
        const user_ip = userIPQueryResult.recordset[0].AP_PCIP
        return user_ip
    }
    return null
}

module.exports = checkUserIP