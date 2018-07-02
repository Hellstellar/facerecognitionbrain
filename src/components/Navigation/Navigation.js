import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const Navigation = () => {
    return (
      <div className = 'fr ma4'>
        <Button color='red' animated>
		      <Button.Content visible>SignOut</Button.Content>
		      <Button.Content hidden>
		        <Icon name='sign out alternate' />
		      </Button.Content>
    		</Button>
      </div>
    );
}

export default Navigation;