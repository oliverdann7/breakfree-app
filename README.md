# BreakFree Türkiye

A premium wellness community mobile application built with React Native and Expo. BreakFree helps users connect, share wellness insights, and support each other on their health and wellness journeys.

## Features

- 📱 Cross-platform mobile app (iOS, Android, Web)
- 🌍 Internationalization support (i18next)
- 🔐 Firebase authentication & security
- 🎨 Beautiful UI with React Native Paper
- 📊 Health metrics tracking & visualization
- 💬 Community engagement features
- 🔔 Push notifications
- 🌙 Dark mode support
- 📱 Responsive design

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit + Redux Persist
- **Navigation**: React Navigation
- **Backend**: Firebase
- **Form Validation**: React Hook Form + Yup
- **UI Library**: React Native Paper
- **Charts**: Victory Native, React Native Chart Kit
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier, Husky

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI: `npm install -g expo-cli`
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/breakfree-app.git
cd breakfree-app

# Install dependencies
npm install

# or with yarn
yarn install

# Setup Firebase configuration
cp .env.local.example .env.local
# Edit .env.local and add your Firebase credentials
```

### Development

```bash
# Start the Expo development server
npm start

# Run on specific platform
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser
```

### Building

```bash
# Build for production (using EAS Build)
npm run eas:build:production

# Build for testing
npm run eas:build:preview
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Project Structure

```
breakfree-app/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── screens/            # Screen components
│   ├── navigation/         # Navigation configuration
│   ├── redux/              # Redux store, slices, selectors
│   ├── services/           # API services, Firebase config
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── i18n/               # Internationalization
├── assets/                 # Images, fonts, etc.
├── docs/                   # Documentation
├── App.tsx                 # Root app component
├── app.json                # Expo configuration
├── package.json            # Dependencies & scripts
└── tsconfig.json           # TypeScript config
```

## Environment Variables

### Firebase Setup

To enable authentication and data storage, you need to configure Firebase:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Copy `.env.local.example` to `.env.local`
3. Add your Firebase credentials to `.env.local`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

You can find these values in your Firebase Console under Project Settings > Your apps > Web > BreakFree.

**Important:** Never commit `.env.local` to version control! The `.env.local` file is already in `.gitignore`.

### Testing Without Firebase
If you don't have Firebase configured yet, the app will show a helpful message on the login screen allowing you to use mock credentials for testing purposes.

## Contributing

We welcome contributions from the community! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to:

- Report bugs
- Suggest features
- Submit pull requests
- Follow our code standards

## Code of Conduct

We're committed to providing a welcoming and inspiring community. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](./docs)
- 🐛 [Issue Tracker](https://github.com/yourusername/breakfree-app/issues)
- 💬 [Discussions](https://github.com/yourusername/breakfree-app/discussions)

## Authors

- **Project Team** - Initial work

## Acknowledgments

- The React Native and Expo communities
- Firebase for backend services
- All our contributors and users
