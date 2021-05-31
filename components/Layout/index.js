import React from 'react'
import styles from './index.module.css'

const Layout = ({ children }) => (
    <div className={styles.content}>
        {children}
    </div>
)

export default Layout