import { registerRootComponent, Platform } from 'expo';
let App;

if (Platform.OS === 'web') {
  App = require('./web').default;
} else {
  App = require('./App').default;
}

registerRootComponent(App);
