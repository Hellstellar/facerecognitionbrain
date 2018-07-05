import React,{ Component } from 'react';
import Rank from '../../components/Rank/Rank'
import ImageLink from '../../components/ImageLink/ImageLink'
import FaceRecognition from '../../components/FaceRecognition/FaceRecognition'
import Clarifai from 'clarifai';
import { Segment, Grid, Transition } from 'semantic-ui-react'
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
			visible: false,
			box: {}
		}
	}

	componentDidMount() {
		this.setState({visible: true})
	}


	calculateFaceBox = (data) => {
		const clarifai_face = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('input-image');
		const height = Number(image.height);
		const width = Number(image.width);
		console.log(height, width)
		console.log(clarifai_face)
		return {
			topRow: clarifai_face.top_row * height,
			leftCol: clarifai_face.left_col * width,
			bottomRow: height - (clarifai_face.bottom_row * height),
			rightCol: width - (clarifai_face.right_col * width),
		}
	}

	displayFaceBox = (box) => {
		this.setState({box: box});
		this.render();
	}
	//Events

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonClick = (event) => {
		this.setState({imageUrl: this.state.input});
		this.setState({input: ''})
	    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
		    (res) => {
		      this.displayFaceBox(this.calculateFaceBox(res));
		    }).catch(err => console.log(err) );
	}

	render() {
		return (
		  <Grid.Row centered columns={2}>
		  	<Grid.Column textAlign='center'>
				  <Rank />
				  <Transition visible={this.state.visible} animation='drop' duration={1500}>
					  <Segment inverted color='red' circular textAlign='center'>
			          	<ImageLink value={this.state.input} visible={this.state.visible} onInputChange = {this.onInputChange} onButtonClick={this.onButtonClick} />
			          </Segment>
			      </Transition>
		          <FaceRecognition box={this.state.box} imageUrl = {this.state.imageUrl} />
		    </Grid.Column>
	      </Grid.Row>
		);
	}
}

export default Wrapper;