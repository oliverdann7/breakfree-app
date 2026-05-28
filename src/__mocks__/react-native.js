const React = require('react');

const View = (props) => React.createElement('View', props, props.children);
const Text = (props) => React.createElement('Text', props, props.children);
const ScrollView = (props) => React.createElement('ScrollView', props, props.children);
const SafeAreaView = (props) => React.createElement('SafeAreaView', props, props.children);
const TouchableOpacity = (props) => React.createElement('TouchableOpacity', props, props.children);
const TextInput = (props) => React.createElement('TextInput', props);
const ActivityIndicator = (props) => React.createElement('ActivityIndicator', props);
const FlatList = (props) => React.createElement('FlatList', props);
const Modal = (props) => React.createElement('Modal', props, props.children);
const KeyboardAvoidingView = (props) =>
  React.createElement('KeyboardAvoidingView', props, props.children);

module.exports = {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  StyleSheet: {
    create: (styles) => styles,
    absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    hairlineWidth: 1,
  },
  Platform: {
    OS: 'ios',
    select: (objs) => objs.ios || objs.default,
    Version: 14,
  },
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
    set: jest.fn(),
    addEventListener: jest.fn(),
  },
  PixelRatio: {
    get: () => 3,
    getFontScale: () => 1,
    getPixelSizeForLayoutSize: (s) => s * 3,
    roundToNearestPixel: (l) => Math.round(l * 3) / 3,
  },
  StatusBar: {
    currentHeight: 44,
    barStyle: 'light-content',
  },
  Animated: {
    View: View,
    Text: Text,
    ScrollView: ScrollView,
    createAnimatedComponent: (c) => c,
    timing: jest.fn(() => ({ start: jest.fn() })),
    spring: jest.fn(() => ({ start: jest.fn() })),
    Value: jest.fn(() => ({ interpolate: jest.fn() })),
    loop: jest.fn(),
    parallel: jest.fn(),
    sequence: jest.fn(),
    stagger: jest.fn(),
    delay: jest.fn(),
  },
  Image: {
    getSize: jest.fn(),
    prefetch: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  Clipboard: {
    getString: jest.fn(),
    setString: jest.fn(),
  },
};
