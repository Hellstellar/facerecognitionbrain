import React from 'react';
import { Image, Transition } from 'semantic-ui-react'
import './FaceRecognition.css'

const FaceRecognition = ({ box, imageUrl }) => {
	let visible = false;
	if(imageUrl.length !== 0) {
		visible = true;
		console.log(box)
	}
	return (
		<div>
		<Transition visible = {visible} animation='zoom' duration={1500}>
			<div>
				<Image id='input-image' src={imageUrl} centered rounded/>
				<div className='boundary-box' style={{top: box.topRow, right: box.rightCol, left: box.leftCol, bottom: box.bottomRow}}></div>
			</div>
		</Transition>
		</div>
	);
}

export default FaceRecognition;