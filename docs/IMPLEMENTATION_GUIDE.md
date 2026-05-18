# BreakFree Türkiye — Implementation Guide

## 🚀 Getting Started (Week 1)

### Prerequisites

- Node.js 18+ (download from nodejs.org)
- npm or pnpm
- Expo CLI: `npm install -g expo-cli`
- Firebase account (console.firebase.google.com)
- Git (for version control)
- Code editor (VS Code recommended)

### Step 1: Project Setup (Day 1)

```bash
# 1. Create Expo project
npx create-expo-app breakfree-app
cd breakfree-app

# 2. Add required dependencies (use provided package.json)
npm install

# 3. Initialize Git
git init
git add .
git commit -m "Initial commit: project setup"

# 4. Create branches
git branch develop
git checkout develop
```

### Step 2: Firebase Configuration (Day 1)

1. Go to Firebase Console (console.firebase.google.com)
2. Create new project: "BreakFree Türkiye"
3. Enable Authentication (Email/Password, Apple, Google)
4. Create Firestore database (Start in test mode for development)
5. Create Storage bucket for avatars
6. Get config from Project Settings

```bash
# Create .env.local file
cat > .env.local << 'EOF'
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EOF
```

### Step 3: Project Structure (Day 2)

```bash
# Create folder structure
mkdir -p app/{screens,components,services,store,utils,hooks,assets/fonts,i18n}
mkdir -p backend/functions
mkdir tests

# Create core files
touch app/App.js
touch app/navigation/RootNavigator.js
touch app/store/index.js
touch app/services/api.js
```

### Step 4: Component Library Setup (Day 2–3)

1. Create 20+ reusable components in `app/components/`
2. Start with basics: Button, Card, Input, Header, TabBar
3. Use design tokens from `designTokens.js`
4. Document in Storybook (optional for MVP)

**Example: Button Component**

```javascript
// app/components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../utils';

const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props
}) => {
  const styles = StyleSheet.create({
    container: {
      height: 48,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      backgroundColor: variant === 'primary' ? colors.gold : 'transparent',
      borderWidth: variant === 'secondary' ? 1 : 0,
      borderColor: colors.border,
      opacity: disabled ? 0.5 : 1,
    },
    text: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.bold,
      color: variant === 'primary' ? colors.navy : colors.textPrimary,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={disabled} {...props}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
```

### Step 5: Navigation Setup (Day 3)

```javascript
// app/navigation/RootNavigator.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { getCurrentUser } from '../services/auth';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);

  useEffect(() => {
    // Check if user already logged in
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Dispatch login action
          dispatch({ type: 'auth/loginFulfilled', payload: { user } });
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkUser();
  }, []);

  if (isLoading) {
    return <SplashScreen />; // TODO: Create splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
```

### Step 6: Store Setup (Day 4)

1. Copy `app_store_index.js` to `app/store/index.js`
2. Create Redux slices:
   - `authSlice.js` (copy from provided file)
   - `userSlice.js` (similar structure)
   - `talksSlice.js`
   - `metricsSlice.js`
3. Configure Redux Persist for offline support

### Step 7: First API Call (Day 4)

```javascript
// app/services/api.js
import axios from 'axios';
import { store } from '../store';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const newToken = await refreshToken();
        // Retry original request
        return api(error.config);
      } catch {
        // Redirect to login
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Step 8: Authentication Screens (Day 5–6)

Create:

1. LoginScreen.js
2. SignupScreen.js
3. OnboardingScreen.js (with goal selection)

Use `react-hook-form` for form handling:

```javascript
// app/screens/Auth/LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { login } from '../../store/slices/authSlice';
import { colors, spacing } from '../../utils';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password required'),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      // Navigation handled by RootNavigator
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BreakFree</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      <Button label="Login" onPress={handleSubmit(onSubmit)} />

      <Button label="Sign Up" variant="secondary" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    padding: spacing[4],
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing[8],
    textAlign: 'center',
  },
});

export default LoginScreen;
```

### Step 9: Home Screen with Data (Day 7)

Create `DashboardScreen.js`:

- Fetch user from Redux
- Display wellness ring (mock data initially)
- Show metric cards
- Display daily plan (mock data)

```javascript
// Use provided WellnessRing component from the HTML preview
// Create animated ring using react-native-svg + React Native Reanimated
```

### Step 10: Testing Setup (Day 8)

```bash
# Create jest.setup.js
cat > jest.setup.js << 'EOF'
import { configure } from '@testing-library/react-native';

configure({ testIdAttribute: 'testID' });

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
}));
EOF

# Run tests
npm test
```

---

## 📋 Week-by-Week Implementation Checklist

### Week 1: Foundation

- [ ] Expo project created + Git setup
- [ ] Firebase configured + .env set
- [ ] Folder structure created
- [ ] 10 core components built
- [ ] Redux store configured
- [ ] Navigation structure defined

### Week 2: Auth

- [ ] Login screen complete
- [ ] Signup screen complete
- [ ] Onboarding flow complete
- [ ] Firebase auth rules written
- [ ] Auth tests written (50% coverage)

### Week 3: Home

- [ ] Dashboard screen layout
- [ ] Wellness ring component
- [ ] Metric cards
- [ ] Redux user slice
- [ ] User profile Firestore sync

### Week 4: Talks

- [ ] Talks list screen
- [ ] Talk detail screen
- [ ] Talk card components
- [ ] Firestore queries
- [ ] Pagination logic

### Week 5: Health & Community

- [ ] Health metrics screen
- [ ] Chart integration
- [ ] Community feed screen
- [ ] Event cards
- [ ] Mock data setup

### Week 6: Settings & Polish

- [ ] Profile screen
- [ ] Settings screens
- [ ] Language selector
- [ ] Theme toggle
- [ ] Bug fixes

### Week 7: Testing & Optimization

- [ ] E2E tests
- [ ] Component tests
- [ ] Performance audit
- [ ] Bundle size optimization
- [ ] Error handling

### Week 8: Beta Launch

- [ ] App Store metadata
- [ ] Privacy policy
- [ ] TestFlight build
- [ ] Play Store setup
- [ ] Beta tester onboarding

---

## 🔑 Key Commands

```bash
# Development
npm start                # Start Expo
npm run ios             # iOS simulator
npm run android         # Android emulator
npm run web             # Web preview

# Testing
npm test                # Run Jest
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Code Quality
npm run lint            # ESLint check
npm run lint:fix        # Auto-fix
npm run format          # Prettier format

# Building
npm run eas:build:preview      # Build for testing
npm run eas:build:production   # Production build
npm run eas:submit             # Submit to stores
```

---

## 📚 Useful Resources

- **React Native Docs**: https://reactnative.dev
- **Expo Docs**: https://docs.expo.dev
- **Firebase SDK**: https://firebase.google.com/docs
- **Redux Toolkit**: https://redux-toolkit.js.org
- **React Navigation**: https://reactnavigation.org
- **React Hook Form**: https://react-hook-form.com

---

## 🐛 Debugging Tips

1. **Redux DevTools**: Install in Firefox/Chrome to inspect state
2. **React Native Debugger**: `npm install --global react-native-debugger`
3. **Firebase Emulator**: Local testing without network
4. **Network Monitor**: Check API calls in Axios interceptors
5. **Logs**: Use `console.log()` liberally, view in Expo CLI

---

## ✅ MVP Launch Checklist

Before TestFlight/Play Store submission:

- [ ] All screens navigable
- [ ] Auth flow end-to-end working
- [ ] At least 2 features functional (auth + dashboard)
- [ ] No console errors or warnings
- [ ] Privacy policy & terms approved
- [ ] App Store screenshots ready
- [ ] Firebase security rules reviewed
- [ ] Crash reporting configured
- [ ] Analytics events tracked
- [ ] 50+ beta testers recruited
- [ ] Build runs <2 seconds startup time
- [ ] Battery drain < 5% per hour
- [ ] Crash-free sessions > 99%

---

## 📞 Support & Questions

- **Slack**: #breakfree-dev (internal)
- **GitHub Issues**: For bugs and features
- **Firebase Support**: console.firebase.google.com/support
- **PM**: Weekly syncs on Monday 10am

---

**Last Updated**: May 17, 2026  
**Status**: Ready for Implementation  
**Next Step**: Week 1 Kickoff Meeting (Monday 9am)
