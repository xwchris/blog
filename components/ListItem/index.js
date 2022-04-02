import React from 'react'
import Link from 'next/link'
import cs from 'classnames';
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
	return (
		<li className="shadow px-8 py-6 mb-6 rounded-md dark:shadow-zinc-800">
			<div className="flex">
				<div className={cs('relative w-14 h-14 rounded-full shrink-0 before:content-["\f110"] before:absolute before:text-4xl before:top-2.5 before:left-2.5', IconStyles.icon, ...getTagNames(data.tags).map(tag => IconStyles[tag]))}></div>
				<div className="ml-3">
					<Link href={`/posts/${id}`}>
						<h3 className="cursor-pointer text-2xl font-medium">
							<a className="hover:underline">{title}</a>
						</h3>
					</Link>
					<div className="text-sm">{date}</div>
				</div>
			</div>
			<p className="mt-4 text-base">{desc}</p>
		</li>
	)
}

export default ListItem