'use client'
import styles from '@/components/LoadingBouncer.module.css'


export default function LoadingBouncer() {
    return (
        <div className={`${styles['loaders']}`}>
            <div className={`${styles['bounce']} ${styles['ball1']}`}></div>
            <div className={`${styles['bounce']} ${styles['ball2']}`}></div>
            <div className={`${styles['bounce']} ${styles['ball3']}`}></div>
            <div className={`${styles['bounce']} ${styles['ball4']}`}></div>
        </div>
    )
}