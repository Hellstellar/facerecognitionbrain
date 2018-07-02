import React from 'react';
import { Header } from 'semantic-ui-react'
import './Rank.css'
import Anime from 'react-anime'

const Logo = () => {
	return (
		<div className='tc mt6'>
		<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 1000}>
			<h1 className = 'message'>{'Sooraj, your current rank is...'}</h1>
			<h1 className = 'rank'>#5</h1>
		</Anime>
		</div>
	);
}

export default Logo;