import React from 'react';
import { Button, Checkbox, Form, Segment, Grid } from 'semantic-ui-react';

const Register = ({ onRouteChange }) => {

	return(
		<Grid centered>
		<Segment inverted color='red' circular textAlign='center'>
			<div style={{padding: '3em 3em 3em 3em'}}>
				<h1>Register</h1>
				<Form>
				    <Form.Field>
				      <input style={{width: '20em'}} placeholder='Username' />
				    </Form.Field>
				    <Form.Field>
				      <input style={{width: '20em'}} type='password' placeholder='Password' />
				    </Form.Field>
				    <Form.Field inline>
				    	<Button onClick={() => onRouteChange('home')} type='submit'>Register</Button>
				    </Form.Field>
				</Form>
			</div>
		</Segment>
		</Grid>
	)
}

export default Register;