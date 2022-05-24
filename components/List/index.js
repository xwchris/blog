import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Toggle from 'react-toggle'
import ListItem from '../ListItem'
import "react-toggle/style.css"
import GithubIcon from '../../assets/images/github.svg'

const useTheme = () => {
	const [theme, setTheme] = useState('light')

	useEffect(() => {
		const storageTheme = window.localStorage.getItem('theme');
		if (storageTheme === 'dark' || (!storageTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			setTheme('dark');
		}
	}, [])

	const handleTheme = (value) => {
		setTheme(value)
		localStorage.setItem('theme', value)
		if (value === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}

	return { theme, handleTheme }
}

const List = ({ data }) => {
	const { theme, handleTheme } = useTheme();
	return (
		<>
			<div className="flex flex-row items-center justify-center mb-8">
				<h2 className="text-3xl font-black">Overfronted</h2>
				<div className="flex-1"></div>
				<a target="_blank" href="https://github.com/xwchris">
					<GithubIcon className="w-8 h-8 mr-4 cursor-pointer" />
				</a>
				<Toggle icons={false} checked={theme === 'dark'} onChange={(e) => handleTheme(e.target.checked ? 'dark' : 'light')}></Toggle>
      </div>
			<ul>
				{
					data.map(post => <ListItem key={post.id} data={post} />)
				}
			</ul>
		</>
	)
}

export default List