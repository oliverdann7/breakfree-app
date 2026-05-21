import './src/i18n';
import React from 'react';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { useAppSelector } from './src/store/hooks';
import BreakFreeLanding from './src/components/BreakFreeLanding';
import WebLoginModal from './src/components/WebLoginModal';
import WebSignupModal from './src/components/WebSignupModal';
import WebDashboard from './src/components/WebDashboard';

function GlobalStyles() {
  return (
    <style>{`
      body { overflow: auto !important; -webkit-overflow-scrolling: touch; }
      html { scroll-behavior: smooth; }
      @media (max-width: 768px) {
        .bf-nav-links { display: none !important; }
      }
    `}</style>
  );
}

function WebAppContent() {
  const [view, setView] = React.useState('landing'); // 'landing', 'login', 'signup'
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <WebDashboard />;
  }

  return (
    <>
      <BreakFreeLanding onStart={() => setView('login')} />
      {view === 'login' && (
        <WebLoginModal onBack={() => setView('landing')} onSignup={() => setView('signup')} />
      )}
      {view === 'signup' && (
        <WebSignupModal onBack={() => setView('landing')} onLogin={() => setView('login')} />
      )}
    </>
  );
}

function WebApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalStyles />
        <WebAppContent />
      </PersistGate>
    </Provider>
  );
}

export default WebApp;
registerRootComponent(WebApp);
