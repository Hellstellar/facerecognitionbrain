import React,{ Component } from 'react';
import Rank from '../../components/Rank/Rank'
import ImageLink from '../../components/ImageLink/ImageLink'
import FaceRecognition from '../../components/FaceRecognition/FaceRecognition'
import Clarifai from 'clarifai';
import { Segment } from 'semantic-ui-react'
//import { FACE_DETECT_KEY } from 'react-native-dotenv'


const app = new Clarifai.App({
 apiKey: 'cbda010d66e74072ab71822dbddb9782'
});

class Wrapper extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
			visible: false
		}
	}

	componentDidMount() {
		this.setState({visible: true})
	}

	//Events
	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonClick = (event) => {
		this.setState({imageUrl: this.state.input});
	    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl).then(
		    (res) => {
		      console.log(res);
		    },
		    (err) => {
		    });
	}

	render() {
		return (
		  <div className = 'wrapper'>
			  <Rank />
			  <Segment circular textAlign='center'>
	          	<ImageLink visible={this.state.visible} onInputChange = {this.onInputChange} onButtonClick={this.onButtonClick} />
	          </Segment>
	          <FaceRecognition imageUrl = {this.state.imageUrl} />
	      </div>
		);
	}
}

export default Wrapper;