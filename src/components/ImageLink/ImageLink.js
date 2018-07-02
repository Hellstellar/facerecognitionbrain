import React from 'react';
import { Input, Button, Icon } from 'semantic-ui-react'
import Anime from 'react-anime'

const ImageLink = () => {
	return (
		<div className = 'tc mt3'>
		<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 1000}>
			<p className = 'message f3 b' style = {{letterSpacing: '2px'}}>This Magic brain will detect faces in your pictures. Give it a try.</p>
			<div>
				<Input placeholder='url:'/>
				<Button animated color='red'>
					<Button.Content visible>Detect</Button.Content>
      				<Button.Content hidden>
        				<Icon name='american sign language interpreting' />
      				</Button.Content>
				</Button>
			</div>
		</Anime>
		</div>
	);
}

export default ImageLink;