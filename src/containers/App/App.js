import React, { Component } from 'react';
import 'tachyons'
import './App.css';
import Navigation from '../../components/Navigation/Navigation'
import Logo from '../../components/Logo/Logo'
import Wrapper from '../../containers/Wrapper/Wrapper'
import Particles from 'react-particles-js';
import { Container, Grid } from "semantic-ui-react"

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
        <Navigation />
        <Container>
          <Grid>
            <Logo />
            <Wrapper />
          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;
