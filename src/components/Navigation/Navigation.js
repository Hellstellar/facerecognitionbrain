import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import 'tachyons'

const Navigation = () => {
    return (
      <div className = 'fr ma4'>
            <Button inverted color='black' animated>
		      <Button.Content visible>SignOut</Button.Content>
		      <Button.Content hidden>
		        <Icon name='sign out alternate' />
		      </Button.Content>
    		</Button>
      </div>
    );
}

export default Navigation;