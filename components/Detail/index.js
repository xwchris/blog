import React from 'react'
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import markdownStyles from './markdown.module.css'
import HomeIcon from '../../assets/images/home.svg'
import Date from '../date'
import Link from 'next/link';

const components = {
	code({ node, inline, className, children, ...props }) {
		const match = /language-(\w+)/.exec(className || '')
		return !inline && match ? (
			<SyntaxHighlighter style={tomorrow} lang={match[1].replace(/^\w/, a => a.toUpperCase())} language={match[1]} children={String(children).replace(/\n$/, '')} {...props} />
		) : (
			<code className={className} {...props}>
				{String(children).replace(/\n$/, '')}
			</code>
		)
	}
}

const Detail = ({ data }) => {
	const { id, title, date, content, author, tags } = data

	return (
		<>
			<div className="mb-9">
				<h3 className="text-4xl font-black">{title}</h3>
				<div className="my-3 text-gray-500 dark:text-gray-100">
					<span>{author}</span>
					{" · "}
					<Date dateString={date} />
					{" · "}
					<span>{tags.split(',').join(', ')}</span>
				</div>
			</div>
			<Markdown children={content} components={components} className={markdownStyles.markdown} />
			<Link href="/">
				<div className="fixed right-9 bottom-9 dark:bg-white rounded-full cursor-pointer hover:shadow-lg shadow-md w-12 h-12 text-2xl flex justify-center items-center">
					<HomeIcon className="w-6 h-6" />
				</div>
			</Link>
		</>
	)
}

export default Detail