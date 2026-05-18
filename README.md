# BreakFree Türkiye

A premium wellness community mobile application built with React Native and Expo.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI: `npm install -g expo-cli`
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/oliverdann7/breakfree-app.git
cd breakfree-app

# Install dependencies
npm install
```

### Firebase Setup

To enable authentication and data storage, configure Firebase:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/).
2. Copy `.env.local.example` to `.env.local`.
3. Add your Firebase credentials to `.env.local`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
# Run on web
npm run web

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios
```

### Building for Production

```bash
# Web
npx expo export --platform web

# Native (using EAS Build)
npm run eas:build:production
```
