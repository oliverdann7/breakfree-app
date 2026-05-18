import './src/i18n'; // initialise i18next before anything renders
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import WebApp from './src/WebApp';
import ErrorBoundary from './src/components/ErrorBoundary';

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

export default function App() {
  if (Platform.OS === 'web') {
    return <WebApp />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Provider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <StatusBar style="light" />
            <RootNavigator />
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
