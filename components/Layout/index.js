import React, { useEffect } from 'react'

const Layout = ({ children }) => {
	useEffect(() => {
		const currentTheme = window.localStorage.getItem('theme');
		// On page load or when changing themes, best to add inline in `head` to avoid FOUC
		if (currentTheme === 'dark' || (!(currentTheme) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [])

	return (
		<div className="w-7/12 mx-auto py-8">
			{children}
		</div>
	)
}

export default Layout