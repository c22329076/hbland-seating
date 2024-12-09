'use client'
import styles from './page.module.css'
import { useContext, useState } from 'react'
//import { AuthContext } from '@/context/AuthProvider'
//import { useCheckLogout } from '@/utils/useCheckLogout.js'
import { useRouter } from 'next/navigation'
//import LoadingBouncer from '@/components/LoadingBouncer'

export default function Login() {
/*
    const router = useRouter()
    const verified = useCheckLogout()
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { setAuth, setIsManager } = useContext(AuthContext)

    const onSubmitSubmit = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let username = event.target.elements.username.value.toUpperCase()
        const password = event.target.elements.password.value
        if (username.includes('\\')) {
            username = username.split('\\')[1]
        }
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        try {
            setIsLoading(false)
            const { auth_result, isManager } = await response.json()

            if (auth_result) {
                setAuth(username)
                setIsManager(isManager)
                setErrorMessage('')
                router.push('/')
            } else {
                setErrorMessage('帳號密碼錯誤')
            }
        } catch (err) {
            setErrorMessage('登入失敗')
        }
        // setLoginUser(auth_user)
        // setLoginUser(authADUser(username, password))
    }
*/
    return (
        (
            (
                <main className={`${styles['login-main']}`}>
                    <div className={`${styles['login-container']}`}>
                        <h2 className={`${styles['login-title']}`}>Login</h2>
                        <span className={`${styles['login-hint']}`}>請使用開機帳號密碼登入</span>
                        <form className={`${styles['login-form']}`}>
                            <label className={`${styles['login-form-lbl']}`}>帳號: </label>
                            <input className={`${styles['login-txt-input']}`} name='username' />
                            <label className={`${styles['login-form-lbl']}`}>密碼: </label>
                            <input className={`${styles['login-txt-input']}`} type='password' name='password' />
                            <p className={`${styles['login-error-msg']}`}></p>
                            {
                            }
                            <button className={`${styles['login-submit']}`} type='submit'>確定</button>
                        </form>
                    </div>
                </main>
            )
        )
    )
}