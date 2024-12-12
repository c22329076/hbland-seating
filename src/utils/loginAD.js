require('dotenv').config()
// const ActiveDirectory = require('activedirectory2')
const ActiveDirectory = require('activedirectory2').promiseWrapper
const url = require('url')

const admin_account = process.env.ADM_ACCOUNT
const admin_password = process.env.ADM_PASSWORD

// 外網
// const config ={
//     url: 'ldap://192.168.1.2',
//     baseDN: 'dc=hbland,dc=local',
//     username: admin_account,
//     password: admin_password
// }

//內網
const config = {
    url: 'ldap://220.1.35.30',
    baseDN: 'dc=HB,dc=CENWEB,dc=LAND,dc=MOI',
    username: process.env.ADM_ACCOUNT,
    password: process.env.ADM_PASSWORD
}

export const ad = new ActiveDirectory(config)

export async function authADUser(username, password) {
    const auth_result = await ad.authenticate(username, password)
    return auth_result // True or False
}

// const isUserExist = function(ad, username) {
//     ad.userExists(username, (err, exists) => {
//         if (err) {
//             console.log(`ERROR: ${JSON.stringify(err)}`)
//             return
//         }
//         console.log(`${username} exists: ${exists}`)
//     })
// }
