import React from 'react';
import { Input, Button, Icon, Form } from 'semantic-ui-react'
import './ImageLink.css'

const ImageLink = ({ visible, onInputChange, onButtonClick }) => {
	return (
		<div>
			<h3 className = 'message' style = {{letterSpacing: '2px'}}>This Magic brain will detect faces in your pictures. Give it a try.</h3>
			<Form onSubmit={this.handleSubmit}>
				<Form.Group inline>
					<Input style={{width: '30em'}} onChange={onInputChange} placeholder='url:'/>	
						<Button onClick={onButtonClick} circular animated inverted>
							<Button.Content visible>Detect</Button.Content>
		      				<Button.Content hidden>
		        				<Icon name='american sign language interpreting' />
		      				</Button.Content>
						</Button>	
				</Form.Group>
			</Form>		
		</div>
	);
}

export default ImageLink;