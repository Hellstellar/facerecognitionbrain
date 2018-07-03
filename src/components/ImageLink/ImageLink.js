import React from 'react';
import { Input, Button, Icon } from 'semantic-ui-react'
import './ImageLink.css'
import { Transition } from 'semantic-ui-react'

const ImageLink = ({ visible, onInputChange, onButtonClick }) => {
	return (
		<div className = 'tc mt3 center'>
			<p className = 'message f3 b' style = {{letterSpacing: '2px'}}>This Magic brain will detect faces in your pictures. Give it a try.</p>
			<Transition visible={visible} animation='swing down' duration={1000}> 
				<Input className="center" onChange={onInputChange} placeholder='url:'/>
			</Transition>
			<Transition visible={visible} animation='swing down' duration={500}>	
				<Button centered onClick={onButtonClick} animated color='red'>
					<Button.Content visible>Detect</Button.Content>
      				<Button.Content hidden>
        				<Icon name='american sign language interpreting' />
      				</Button.Content>
				</Button>
			</Transition>
		</div>
	);
}

export default ImageLink;