import React from 'react'
import Tilt from 'react-tilt'
import 'tachyons'
import Brain from './brain.ico'

const Logo = () => {
	return (
		<div className="mt3">
			<Tilt className="Tilt" options={{ max : 55 }} style={{ height: 150, width: 150, margin: '5px auto' }} >
 				<div className="Tilt-inner"><img alt="brain" src={Brain}/></div>
			</Tilt>
		</div>
	);
}

export default Logo;