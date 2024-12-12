'use client'

import { createContext, useState } from 'react';

// 創建 AuthContext，初始值為 null
export const AuthContext = createContext('');

export default function AuthProvider({ children }) {
    // 初始化狀態
    const [auth, setAuth] = useState(null);
    const [isManager, setIsManager] = useState(false);

    console.log('AuthProvider initialized with:', { auth, isManager });

    // 確保傳遞的 value 結構正確
    const value = {
        auth,
        setAuth,
        isManager,
        setIsManager,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}