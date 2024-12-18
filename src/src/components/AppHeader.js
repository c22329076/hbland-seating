'use client'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/context/AuthProvider.js'
import styles from '@/components/AppHeader.module.css'
import { useRouter } from 'next/navigation'
import { PostTimestampContext } from '@/context/PostTimestampProvider'
import { debuglog } from 'util'

export default function AppHeader() {
    const { auth, setAuth, isManager, setIsManager } = useContext(AuthContext)
    const { setPostTimestamp } = useContext(PostTimestampContext)
    const [isAuthChecked, setIsAuthChecked] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/verifyLogin')
            .then(res => {
                return res.json()
            })
            .then(({ valid, username, isManager }) => {
                setIsAuthChecked(true)

                if (valid) {
                    setAuth(username)
                    setIsManager(isManager)
                }
            })
    }, [])

    const onManagerPageClicked = (event) => {
        router.push()
    }

    const onExportClicked = (event) => {
        fetch('api/scheduleList', {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        }).then(res => res.json())
            .then(({ userScheduleList }) => {
                // delete user data from schedulelist

                userScheduleList = userScheduleList.map(schedule => {
                    delete schedule.sn
                    delete schedule.user_id
                    delete schedule.create_at
                    return schedule
                })
                console.log(userScheduleList)
                const fileName = 'ExportSchedule.json'
                const json = JSON.stringify(userScheduleList, null, 2)
                const blob = new Blob([json], { type: 'application/json' })
                const href = URL.createObjectURL(blob)

                const link = document.createElement('a')
                link.href = href
                link.download = fileName
                document.body.appendChild(link)
                link.click()

                document.body.removeChild(link)
                URL.revokeObjectURL(href)
            })
    }

    const onReaderLoad = (event) => {
        const importedSchedules = JSON.parse(event.target.result)
        fetch('/api/importSchedule', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(
                {
                    user_id: auth,
                    scheduleList: importedSchedules
                }
            )
        }).then(res => {
            console.log('Import Successed')
            setPostTimestamp(new Date())
            return res.json()
        }).catch(err => {
            console.log(err)
        })
    }

    const onImportChange = (event) => {
        const jsonFile = event.target.files[0]
        const reader = new FileReader()
        reader.onload = onReaderLoad
        reader.readAsText(jsonFile)
        // console.log(jsonFile)
        // const form_data = new FormData()
        // form_data.append('jsonFile', jsonFile, '', {type:'application/json'})
        // console.log({
        //     userid: auth,
        //     form_data
        // })

    }

    const onLoginClicked = (event) => {
        router.push('/login')
    }

    const onSignoutClicked = (event) => {
        fetch('/api/logout').then(res => res.json())
            .then(() => {
                setAuth('')
                router.push('/login')
            })
    }

    return (
        <div className={`${styles['app-header']}`}>
            <h1 className={`${styles['app-header-title']}`}><a href='/'>中壢地政事務所 座位表</a></h1>
            <div className={`${styles['app-header-auth-sec']} ${isManager ? styles['manager-header'] : ''}`}>
                {
                    isAuthChecked && (
                        auth ?
                            <>
                                {isManager &&
                                    <a href='/managerManagement'><button className={`${styles['header-btn']}`} onClick={onManagerPageClicked}>
                                            主管查詢
                                        </button></a>}
                                <button className={`${styles['header-btn']}`} onClick={onExportClicked}>
                                    匯出排程
                                </button>

                                <div className={`${styles['header-btn']}`}>
                                    <input id='import-schedule' className={`${styles['invisible']}`} type='file' styles='height:50px' onChange={onImportChange} accept='application/JSON' />
                                    <label for='import-schedule' className={`${styles['abs-center']}`}>匯入排程</label>
                                </div>
                                <button className={`${styles['header-btn']}`} onClick={onSignoutClicked}>登出</button>
                            </>
                            :
                            <button className={`${styles['header-btn']}`} onClick={onLoginClicked}>登入</button>
                    )
                }
            </div>
        </div>
    )
}