import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/Home/DashboardScreen';
import TalksListScreen from '../screens/Talks/TalksListScreen';
import TalkDetailScreen from '../screens/Talks/TalkDetailScreen';
import HealthMetricsScreen from '../screens/Health/HealthMetricsScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import MentorScreen from '../screens/Mentor/MentorScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import { colors } from '../constants/designTokens';

const Tab = createBottomTabNavigator();
const TalksStack = createStackNavigator();
const ProfileStack = createStackNavigator();

function TabIcon({ label, focused }) {
  const icons = {
    'Ana Sayfa': '⬡',
    Palestralar: '🎙',
    Sağlık: '💚',
    Topluluk: '👥',
    Mentör: '🤝',
    Profil: '👤',
  };
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{icons[label] || '●'}</Text>;
}

function TalksStackNavigator() {
  return (
    <TalksStack.Navigator screenOptions={{ headerShown: false }}>
      <TalksStack.Screen name="TalksList" component={TalksListScreen} />
      <TalksStack.Screen name="TalkDetail" component={TalkDetailScreen} />
    </TalksStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    </ProfileStack.Navigator>
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
      <Tab.Screen name="Mentör" component={MentorScreen} />
      <Tab.Screen name="Profil" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bgSecondary,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '500',
  },
});
