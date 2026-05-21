import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { useAppSelector } from './store/hooks';
import BreakFreeLanding from './components/BreakFreeLanding';
import WebLoginModal from './components/WebLoginModal';
import WebDashboard from './components/WebDashboard';

function AppRouter() {
  const [showLogin, setShowLogin] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <WebDashboard />;
  }

  if (showLogin) {
    return <WebLoginModal onBack={() => setShowLogin(false)} />;
  }

  return <BreakFreeLanding onStart={() => setShowLogin(true)} />;
}

function GlobalStyles() {
  return (
    <style>{`
      body { overflow: auto !important; -webkit-overflow-scrolling: touch; }
      html { scroll-behavior: smooth; }
    `}</style>
  );
}

export default function WebApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalStyles />
        <AppRouter />
      </PersistGate>
    </Provider>
  );
}
