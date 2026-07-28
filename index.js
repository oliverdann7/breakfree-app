import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

// Platform split at module load time. NOTE: never use `typeof window` for
// this — React Native defines `global.window`, so that guard sends native
// devices down the web path.
const RootApp =
  Platform.OS === 'web'
    ? require('./web.js').default // web-only root (landing + dashboard)
    : require('./App.tsx').default; // full native app

registerRootComponent(RootApp);
