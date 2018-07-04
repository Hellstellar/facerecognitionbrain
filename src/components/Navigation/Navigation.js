import React from 'react'
import { Button, Icon, Grid } from 'semantic-ui-react'

const Navigation = () => {
    return (
      <div>
        <Grid padded>
          <Grid.Column floated='right' width={3}>
              <Button circular color='red' animated>
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

export default Navigation;