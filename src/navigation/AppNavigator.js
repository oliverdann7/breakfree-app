import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/Home/DashboardScreen';
import TalksListScreen from '../screens/Talks/TalksListScreen';
import TalkDetailScreen from '../screens/Talks/TalkDetailScreen';
import HealthMetricsScreen from '../screens/Health/HealthMetricsScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { colors } from '../constants/designTokens';

const Tab = createBottomTabNavigator();
const TalksStack = createStackNavigator();

function TabIcon({ label, focused }) {
  const icons = {
    'Ana Sayfa': focused ? '⬡' : '⬡',
    'Palestralar': focused ? '🎙' : '🎙',
    'Sağlık': focused ? '💚' : '💚',
    'Topluluk': focused ? '👥' : '👥',
    'Profil': focused ? '👤' : '👤',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
      {icons[label] || '●'}
    </Text>
  );
}

function TalksStackNavigator() {
  return (
    <TalksStack.Navigator screenOptions={{ headerShown: false }}>
      <TalksStack.Screen name="TalksList" component={TalksListScreen} />
      <TalksStack.Screen name="TalkDetail" component={TalkDetailScreen} />
    </TalksStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={DashboardScreen} />
      <Tab.Screen name="Palestralar" component={TalksStackNavigator} />
      <Tab.Screen name="Sağlık" component={HealthMetricsScreen} />
      <Tab.Screen name="Topluluk" component={CommunityScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bgSecondary,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
});
