import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import BreakFreeLanding from './components/BreakFreeLanding';
import WebLoginModal from './components/WebLoginModal';

export default function WebApp() {
  const [showLogin, setShowLogin] = useState(false);

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
