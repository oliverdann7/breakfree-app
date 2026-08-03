import React, { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { restoreSession } from '../store/slices/authSlice';
import { setupNotificationResponseHandler } from '../services/notificationService';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';

const Stack = createStackNavigator();

export const navigationRef = createNavigationContainerRef();

// breakfree:// (dev/OAuth callbacks) + the production web origin.
const linking = {
  prefixes: [Linking.createURL('/'), 'https://breakfree.app'],
};

function SplashScreen() {
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

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isInitializing = useAppSelector((state) => state.auth.isInitializing);
  const hasCompletedOnboarding = useAppSelector((state) => state.user.hasCompletedOnboarding);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Route notification taps ({ screen, params } payloads) once signed in.
  useEffect(() => {
    if (Platform.OS === 'web') return undefined;
    const subscription = setupNotificationResponseHandler(navigationRef);
    return () => subscription.remove();
  }, []);

  if (isInitializing) return <SplashScreen />;

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          hasCompletedOnboarding ? (
            <Stack.Screen name="App" component={AppNavigator} />
          ) : (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
