import React from 'react';
import './Rank.css'


const Logo = () => {
	return (
		<div className='tc mt5'>
			<h1 className = 'message'>{'Sooraj, your current rank is...'}</h1>
			<h1 className = 'rank'>#5</h1>
		</div>
	);
}

export default Logo;