import React from 'react'
import Tilt from 'react-tilt'
import Brain from './brain.ico'
import { Grid } from 'semantic-ui-react'

const Logo = () => {
	return (
		<Grid.Row centered columns={2}>
			<Grid.Column>
				<Grid centered>		
					<Tilt className="Tilt" options={{ max : 55 }} style={{ height: 170, width: 170}} >
		 				<div className="Tilt-inner"><img alt="brain" src={Brain}/></div>
					</Tilt>
				</Grid>
			</Grid.Column>
		</Grid.Row>
	);
}

export default Logo;