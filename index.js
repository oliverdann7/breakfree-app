import { registerRootComponent } from 'expo';

// Load appropriate entry point based on environment
let RootApp;
if (typeof window !== 'undefined') {
  // Web environment - import web-only entry point
  RootApp = require('./web.js').default;
} else {
  // Native environment - import full app
  RootApp = require('./App.tsx').default;
}

registerRootComponent(RootApp);
