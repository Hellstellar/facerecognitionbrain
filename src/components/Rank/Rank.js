import React from 'react';
import './Rank.css'
import { Grid } from 'semantic-ui-react'

const Logo = () => {
	return (
		<Grid.Row centered columns={2}>
			<Grid.Column textAlign='center'>
					<h1 className = 'message'>{'Sooraj, your current rank is...'}</h1>
					<h1 style = {{ color: 'red' }}>#5</h1>
			</Grid.Column>
		</Grid.Row>
	);
}

export default Logo;