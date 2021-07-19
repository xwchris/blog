import React from 'react'
import Link from 'next/link'
import ListItem from '../ListItem'
import styles from './index.module.css'

const List = ({ data }) => {
    return (
        <div className={styles.container}>
            <div className={styles.titleBlock}>
                <h2 className={styles.title}>最新文章</h2>
            </div>
            <ul className={styles.list}>
                {
                    data.map(post => <ListItem key={post.id} data={post} />)
                }
            </ul>
        </div>
    )
}

export default List