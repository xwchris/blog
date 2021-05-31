import React from 'react'
import cs from 'classnames';
import Markdown from 'react-markdown';
import styles from './index.module.css'
import cardStyles from '../ListItem/index.module.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import markdownStyles from './markdown.module.css'
import Date from '../date'

const components = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
            <SyntaxHighlighter style={tomorrow} language={match[1]} children={String(children).replace(/\n$/, '')} {...props} />
        ) : (
            <code className={className} {...props}>
                {String(children).replace(/\n$/, '')}
            </code>
        )
    }
}


const Detail = ({ data }) => {
    const { id, title, date, content } = data
    
    return (
        <div>
            <ol className={styles.breadcrumb}>
                <li className={styles.breadcrumbItem}>Home</li>
                <li className={cs(styles.breadcrumbItem, styles.active)}>{title}</li>
            </ol>
            <div className={cardStyles.card}>
                <div className={cardStyles.cardTop}>
                    <div className={cardStyles.cardData}>
                        <h3 className={cardStyles.cardTitle}>
                            {title}
                        </h3>
                        <div className={cardStyles.cardTag}>{date}</div>
                    </div>
                </div>
                <div className={cardStyles.cardDesc}>
                    <Markdown children={content} components={components} className={markdownStyles.markdown} />
                </div>
            </div>
        </div>
    )
}

export default Detail