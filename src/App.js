import React, { Component } from 'react';
import 'tachyons'
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLink from './components/ImageLink/ImageLink'
import Anime from 'react-anime'
import Particles from 'react-particles-js';

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


class App extends Component {
  
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
        <ImageLink />
        {/*<FaceRecognition />*/}
      </div>
    );
  }
}

export default App;
