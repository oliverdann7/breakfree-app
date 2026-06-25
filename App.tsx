import './src/i18n'; // initialise i18next before anything renders
import { syncLanguage } from './src/i18n';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, ActivityIndicator } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import WebApp from './src/WebApp';
import ErrorBoundary from './src/components/ErrorBoundary';
import { registerForPushNotificationsAsync } from './src/services/notificationService';
import { initSentry } from './src/services/sentryService';
import { initRemoteConfig } from './src/services/remoteConfig';

// Fire-and-forget at module load — both gracefully no-op when SDKs/keys missing.
initSentry();
initRemoteConfig();

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0A2540',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator color="#14B8D4" size="large" />
    </View>
  );
}

function MobileAppContent() {
  const { user } = useSelector((s: any) => s.auth);
  const language = useSelector((s: any) => s.user?.preferences?.language);

  useEffect(() => {
    registerForPushNotificationsAsync(user?.uid);
  }, [user?.uid]);

  // Restore the persisted language once the store has rehydrated, and keep
  // i18next in sync with later preference changes.
  useEffect(() => {
    syncLanguage(language);
  }, [language]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <RootNavigator />
    </GestureHandlerRootView>
  );
}

function MobileApp() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <MobileAppContent />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

export default function App() {
  if (Platform.OS === 'web') {
    return <WebApp />;
  }
  return <MobileApp />;
}
