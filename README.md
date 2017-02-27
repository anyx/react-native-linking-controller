[![Build Status](https://travis-ci.org/anyx/react-native-linking-controller.svg?branch=master)](https://travis-ci.org/anyx/react-native-linking-controller)

# react-native-linking-controller

Small library for manage actions that come from external urls. Created for more convenient work with
 [Linking](https://facebook.github.io/react-native/docs/linking.html) 

## Example

```javascript
import React from 'react';
import {
    View,
    Linking
} from 'react-native';
import {
    setTheme,
} from 'react-native-material-kit';
import LinkingController from 'react-native-linking-controller';

const linkingActions = {
    //using default matcher: runs if url contains correct parameter `action`
    //Example: http://some.com?action=first-action
    'first-action': (action, context) => {
        dispatch(actions.security.setPasswordResetToken(action.params.token));
    },
    //custom matcher
    'another-action': {
        match: (url) => {
            //should return object that contains action params in case match url
            //false otherwise
        },
        action: (action, context) => {
            //do some staff
        }
    }
};

export default class App extends React.Component {
    //...
    componentDidMount() {
        //Possible actions context. Passed in second action parameter
        let actionsContext = this.context;
        let linkingController = new LinkingController(actionsContext);
        
        _.each(linkingActions, (callback, action) => {
            linkingController.registerAction(action, callback);
        });

        linkingController.bindToLinking(Linking);
    }
}
```

More information you can get in [tests](/__tests__)

## License
[MIT](/LICENSE)
