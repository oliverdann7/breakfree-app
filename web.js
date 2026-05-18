import './src/i18n';
import React from 'react';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import BreakFreeLanding from './src/components/BreakFreeLanding';
import WebLoginModal from './src/components/WebLoginModal';

function WebApp() {
  const [showLogin, setShowLogin] = React.useState(false);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {showLogin ? (
          <WebLoginModal onBack={() => setShowLogin(false)} />
        ) : (
          <BreakFreeLanding onStart={() => setShowLogin(true)} />
        )}
      </PersistGate>
    </Provider>
  );
}

export default WebApp;
registerRootComponent(WebApp);
