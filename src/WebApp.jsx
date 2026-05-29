import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { useAppSelector } from './store/hooks';
import BreakFreeLanding from './components/BreakFreeLanding';
import WebLoginModal from './components/WebLoginModal';
import WebDashboard from './components/WebDashboard';
import LegalPage from './components/web/LegalPage';
import AdminPage from './components/web/AdminPage';

function AppRouter() {
  const [showLogin, setShowLogin] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Lightweight client-side routing for /legal/{section}.
  // A single static route family doesn't need react-router.
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const legalMatch = path.match(/^\/legal(?:\/(privacy|terms|kvkk))?\/?$/);
  if (legalMatch) {
    return <LegalPage section={legalMatch[1] || 'privacy'} />;
  }
  if (path.startsWith('/admin')) {
    return <AdminPage />;
  }

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
