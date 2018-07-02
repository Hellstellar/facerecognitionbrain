import React, { Component } from 'react';
import 'tachyons'
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLink from './components/ImageLink/ImageLink'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Anime from 'react-anime'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const particleOptions = { 
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}


const app = new Clarifai.App({
 apiKey: 'cbda010d66e74072ab71822dbddb9782'
});


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }

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
    }
);
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' 
              params={particleOptions}
            />
        <Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 1000}>
          <div>
            <Navigation />
            <Logo />
          </div>
        </Anime>
        <Rank />
        <ImageLink onInputChange = {this.onInputChange} onButtonClick={this.onButtonClick} />
        <FaceRecognition imageUrl = {this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
