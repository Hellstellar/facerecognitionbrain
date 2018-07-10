import React, { Component } from 'react';
import './App.css';
import Navigation from '../../components/Navigation/Navigation'
import Logo from '../../components/Logo/Logo'
import Wrapper from '../../containers/Wrapper/Wrapper'
import Particles from 'react-particles-js';
import { Container, Grid } from "semantic-ui-react"
import SignIn from '../../components/SignIn/SignIn';
import Register from '../../components/Register/Register';

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
  
  constructor() {
    super();
    this.state = {
      route: 'signin',
      isSignedIn: false
    }
  }

  onRouteChange = (route) => {
    if(route === 'home')
      this.setState({isSignedIn: true})
    else
      this.setState({isSignedIn: false})
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' 
          params={particleOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        <Container>
           { this.state.route === 'home' ?
              <Grid>
                <Logo />
                <Wrapper />
              </Grid>
              : (  this.state.route === 'signin' ?
                    <Grid columns={2} centered>
                      <Grid.Column>
                        <SignIn onRouteChange={this.onRouteChange}/>
                      </Grid.Column>
                    </Grid>
                    : <Grid columns={2} centered>
                        <Grid.Column>
                          <Register onRouteChange={this.onRouteChange}/>
                        </Grid.Column>
                      </Grid> )
            }
        </Container>
      </div>
    );
  }
}

export default App;
