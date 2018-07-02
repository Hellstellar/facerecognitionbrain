import React from 'react';
import { Image } from 'semantic-ui-react'


const FaceRecognition = ({ imageUrl }) => {
	return (
		<div className='mt5'>
			<Image src={imageUrl} size='large' rounded centered/>
		</div>
	);
}

export default FaceRecognition;