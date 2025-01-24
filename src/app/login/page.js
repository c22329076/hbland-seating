'use client';

import styles from './page.module.css';
import { useContext, useEffect, useState } from 'react';
import { useCheckLogout } from '@/utils/useCheckLogout.js';
import { useRouter } from 'next/navigation';
import LoadingBouncer from '@/components/LoadingBouncer';
import { AuthContext } from '@/context/AuthProvider';
import { AuthProvider } from '@/context/AuthProvider';

export default function Login() {
    return (
            <LoginPage />
    );
}

function LoginPage() {
    const [ setAuth, setIsManager ] = useContext(AuthContext); // 從上下文中獲取函數

    console.log('Context values:', { setAuth, setIsManager });

    const router = useRouter();
    const verified = useCheckLogout();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const usernameInput = event.target.elements.username.value.trim();
        const password = event.target.elements.password.value;
        let username = usernameInput.includes('\\') ? usernameInput.split('\\')[1].toUpperCase() : usernameInput.toUpperCase();

        try {
            const loginTime = new Date().toLocaleString('zh-TW', {hour12: false});
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({ username, password, loginTime }),
            });

//            if (!response.ok) {
//                throw new Error('Network response was not ok');
//            }

            const { auth_result, isManager } = await response.json();
            
            if (auth_result) {
                setAuth(username);
                setIsManager(isManager);
                setErrorMessage('');
                router.repleace('/');
            } else {
                setErrorMessage('登入失敗，請稍後再試');
            }
        } catch (error) {
            console.error('Login failed:', error);
            //setErrorMessage('登入失敗，請稍後再試');

            await location.reload();//重新整理 我作弊==
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles['login-main']}>
            {verified && (
            <div className={styles['login-container']}>
                <h2 className={styles['login-title']}>Login</h2>
                <span className={styles['login-hint']}>請使用開機帳號密碼登入</span>
                <form className={styles['login-form']} onSubmit={handleSubmit}>
                    <label className={styles['login-form-lbl']}>帳號:</label>
                    <input
                        className={styles['login-txt-input']}
                        name="username"
                        required
                    />
                    <label className={styles['login-form-lbl']}>密碼:</label>
                    <input
                        className={styles['login-txt-input']}
                        type="password"
                        name="password"
                        required
                    />
                    <p className={styles['login-error-msg']}>{errorMessage}</p>
                    {isLoading && <LoadingBouncer />}
                    <button
                        className={styles['login-submit']}
                        type="submit"
                        disabled={isLoading}
                    >
                        確定
                    </button>
                </form>
            </div>
            )}
        </main>
    );
}
