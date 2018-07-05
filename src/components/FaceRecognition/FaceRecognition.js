import React from 'react';
import { Image, Transition, Grid } from 'semantic-ui-react'
import './FaceRecognition.css'

const FaceRecognition = ({ box, imageUrl }) => {
	let visible = false;
	if(imageUrl.length !== 0) {
		visible = true;
	}
	return (
		<div>
			<Transition visible = {visible} animation='zoom' duration={1500}>
				<Grid centered columns={2}>
					<Grid.Column >
						<Image id='input-image' src={imageUrl} fluid centered rounded/>
						<div className='boundary-box' style={{position: 'absolute', top: box.topRow, right: box.rightCol, left: box.leftCol, bottom: box.bottomRow}}></div>
					</Grid.Column>
				</Grid>
			</Transition>
		</div>
	);
}

export default FaceRecognition;