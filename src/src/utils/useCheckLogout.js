'use client'

import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'

export function useCheckLogout()  {
    
    const [verified, setVerified] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/verifyLogin')
        .then(res => {
            return res.json()
        })
        .then(({valid}) => {
            if (valid) {
                router.push('/')
                return
            }
            setVerified(true)
        })
    }, [])
    return verified
}