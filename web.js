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

const FAVICON_SVG =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjMuNyAzMjMuNyIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiPgogIDxyZWN0IHdpZHRoPSIzMjMuNyIgaGVpZ2h0PSIzMjMuNyIgZmlsbD0iIzA2MTgyOSIgcng9IjQwIi8+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzIuNCwgMzApIj4KICAgIDxzdHlsZT4uc3Qwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6IzAwNzJCMDt9LnN0MXtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiNDOTk2MUE7fTwvc3R5bGU+CiAgICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTM2LjcsMTEyLjZjLTIzLjgtMzUuOC04NS40LDkuNC02MS42LTgyLjNDNjUsNTAuNSw1OC40LDcyLjUsNTYuMSw5NS44YzMuNSwxMy43LDEwLjgsMjcsMTkuMywzNy43YzEuNCwxLjgsMi45LDMuNiw0LjYsNS40YzguNSw5LjMsMTgsMTYuMywyNi42LDIwLjFjMi40LDEsNC43LDEuOCw2LjgsMi4yYy0xMi4xLTEwLjctMzMuOC0zOS44LTIwLjItNTIuN0MxMDEuNiwxMDAuNSwxMjAsMTAxLjUsMTM2LjcsMTEyLjZMMTM2LjcsMTEyLjZ6IE02Mi44LDE2Ni42YzYuMSwyMC43LDE1LjcsNDAuMSwyOC4zLDU3LjVjLTUuNC0xMy43LTkuMi0yOC4xLTExLjItNDNjLTQuMi0zLjItOC41LTYuNi0xMi43LTEwLjNDNjUuNywxNjkuNCw2NC4yLDE2OCw2Mi44LDE2Ni42TDYyLjgsMTY2LjZ6Ii8+CiAgICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNODkuMiw1My42YzYuNiwwLDEyLDUuNCwxMiwxMmMwLDYuNy01LjQsMTIuMS0xMiwxMi4xYy02LjcsMC0xMi4xLTUuNC0xMi4xLTEyLjFDNzcuMSw1OSw4Mi41LDUzLjYsODkuMiw1My42TDg5LjIsNTMuNnoiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMTAuMSwxMDguOWMxLjMsMS4yLDIuNCwyLjUsMy43LDMuOGMyMSwyMy4xLDI4LjIsNDkuNiwxNi4xLDU5LjJDOTUuOSwxOTguNywxLjgsODYuNiw2NS44LDQzLjFjLTMzLjcsMjYuNy0xNC45LDc0LjUsOSwxMDAuOGMxNy44LDE5LjcsNDAuMSwyOS4zLDQ5LjgsMjEuN2M5LjctNy43LDMuMi0yOS44LTE0LjctNDkuNGMtMi41LTIuNy01LjEtNS4yLTcuNy03LjZjMi4yLTAuMyw0LjQtMC4zLDYuOSwwLjFDMTA5LjUsMTA4LjgsMTA5LjgsMTA4LjgsMTEwLjEsMTA4LjlMMTEwLjEsMTA4Ljl6Ii8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzkuOCw4MS42Yy0xLjMsMC44LTIuNiwxLjctMy43LDIuOGMtMTUuNiwxNS0xLjQsNTEuMywzMS43LDgxYzQ2LjgsNDIuMSw5OCw0NS4xLDg3LjMsNS4xYzEsNi43LTEuNSwxMi43LTUuMiwxNi4zYy0xMiwxMS45LTQ1LjYtMC42LTc1LjEtMjcuN2MtMjcuNC0yNS4zLTQxLjYtNTQuNS0zMy45LTY3LjlDNDAuMyw4OCw0MCw4NC44LDM5LjgsODEuNkwzOS44LDgxLjZ6Ii8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTQ0LjEsMjMyLjJjLTIyLjctOS4xLTkyLTUuNS0xMTMuNyw2QzYzLjUsMjE2LjcsMTA5LjEsMjE0LjMsMTQ0LjEsMjMyLjJMMTQ0LjEsMjMyLjJ6Ii8+CiAgPC9nPgo8L3N2Zz4';

function GlobalStyles() {
  return (
    <>
      <style>{`
        body { overflow: auto !important; -webkit-overflow-scrolling: touch; }
        html { scroll-behavior: smooth; }
        @media (max-width: 768px) {
          .bf-nav-links { display: none !important; }
        }
      `}</style>
      <link rel="icon" type="image/svg+xml" href={FAVICON_SVG} />
    </>
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
