import './src/i18n';
import React from 'react';
import { registerRootComponent } from 'expo';
import WebApp from './src/WebApp';

export default function RootApp() {
  return <WebApp />;
}

registerRootComponent(RootApp);
