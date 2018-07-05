import React from 'react'
import { Button, Icon, Grid } from 'semantic-ui-react'

const Navigation = ({ onRouteChange, isSignedIn }) => {
    if(isSignedIn) {
      return (
        <div>
          <Grid padded>
            <Grid.Column floated='right' width={3}>
                <Button onClick={() => onRouteChange('signin')} circular color='red' animated>
                  <Button.Content visible>SignOut</Button.Content>
                  <Button.Content hidden>
                    <Icon name='sign out alternate' />
                  </Button.Content>
                </Button>
            </Grid.Column>
          </Grid>
        </div>
      );
    }
    else {
        return (
          <Grid padded>
            <Grid.Column floated='right' width={3}>
                <Button onClick={() => onRouteChange('register')} circular color='red' animated>
                  <Button.Content visible>Register</Button.Content>
                  <Button.Content hidden>
                    <Icon name='sign out alternate' />
                  </Button.Content>
                </Button>
                <Button onClick={() => onRouteChange('signin')} circular color='red' animated>
                  <Button.Content visible>Sign In</Button.Content>
                  <Button.Content hidden>
                    <Icon name='sign out alternate' />
                  </Button.Content>
                </Button>
            </Grid.Column>
          </Grid>
        );
    }
    
}

export default Navigation;