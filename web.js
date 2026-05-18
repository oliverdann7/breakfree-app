import './src/i18n';
import React from 'react';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { useAppSelector } from './src/store/hooks';
import BreakFreeLanding from './src/components/BreakFreeLanding';
import WebLoginModal from './src/components/WebLoginModal';
import WebDashboard from './src/components/WebDashboard';

function WebAppContent() {
  const [showLogin, setShowLogin] = React.useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <WebDashboard />;
  }

  return showLogin ? (
    <WebLoginModal onBack={() => setShowLogin(false)} />
  ) : (
    <BreakFreeLanding onStart={() => setShowLogin(true)} />
  );
}

function WebApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WebAppContent />
      </PersistGate>
    </Provider>
  );
}

export default WebApp;
registerRootComponent(WebApp);
