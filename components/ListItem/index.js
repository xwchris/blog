import React from 'react'
import Link from 'next/link'
import cs from 'classnames';
import styles from './index.module.css'
import IconStyles from '../../styles/icon.module.css'

const tagMap = {
    'css': 'css',
    'js': 'js',
    'javascript': 'js',
    'react': 'react',
    'blog': 'blog',
    'git': 'git'
}

function getTagNames(tagStr) {
    const tags = tagStr.split(',') || ['blog'];
    const firstTag = tagMap[tags[0].toLowerCase()] || 'blog'
    return [
        `icon-${firstTag}`,
        `icon${firstTag.replace(/^\w/, (w) => w.toUpperCase())}`
    ]
}

const ListItem = ({ data }) => {
    const { id, title, date, desc } = data;
    console.log(data)
    return (
        <li className={styles.card}>
            <div className={styles.cardTop}>
                <div className={cs(styles.cardIcon, IconStyles.icon, ...getTagNames(data.tags).map(tag => IconStyles[tag]))}></div>
                <div className={styles.cardData}>
                    <Link href={`/posts/${id}`}>
                        <h3 className={styles.cardTitle}>
                            <a>{title}</a>
                        </h3>
                    </Link>
                    <div className={styles.cardTag}>{date}</div>
                </div>
            </div>
            <div className={styles.cardDesc}>
                <p>{desc}</p>
            </div>
        </li>
    )
}

export default ListItem