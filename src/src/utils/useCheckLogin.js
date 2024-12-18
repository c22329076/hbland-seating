'use client'

import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'

export function useCheckLogin() {
    
    const [verified, setVerified] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/verifyLogin')
        .then(res => {
            return res.json()
        })
        .then(({valid}) => {
            if (!valid) {
                router.push('/login')
                return
            }
            setVerified(true)
        })
    }, [])
    return verified
}