import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import DashboardScreen from '../screens/Home/DashboardScreen';
import TalksListScreen from '../screens/Talks/TalksListScreen';
import TalkDetailScreen from '../screens/Talks/TalkDetailScreen';
import HealthMetricsScreen from '../screens/Health/HealthMetricsScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import ChallengesScreen from '../screens/Community/ChallengesScreen';
import LeaderboardScreen from '../screens/Community/LeaderboardScreen';
import MentorScreen from '../screens/Mentor/MentorScreen';
import MentorDirectoryScreen from '../screens/Mentor/MentorDirectoryScreen';
import MentorDetailScreen from '../screens/Mentor/MentorDetailScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import PremiumScreen from '../screens/Premium/PremiumScreen';
import PrivacyScreen from '../screens/Profile/PrivacyScreen';
import NotificationsScreen from '../screens/Profile/NotificationsScreen';
import ConnectedDevicesScreen from '../screens/Profile/ConnectedDevicesScreen';
import VideoFeedScreen from '../screens/Videos/VideoFeedScreen';
import VideoPlayerScreen from '../screens/Videos/VideoPlayerScreen';
import { colors } from '../constants/designTokens';

const Tab = createBottomTabNavigator();
const TalksStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const VideoStack = createStackNavigator();
const CommunityStack = createStackNavigator();
const MentorStack = createStackNavigator();

const TAB_ICONS = {
  Home: '⬡',
  Talks: '🎙',
  Videos: '🎬',
  Health: '💚',
  Community: '👥',
  Mentor: '🤝',
  Profile: '👤',
};

function TabIcon({ routeName, focused }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{TAB_ICONS[routeName] || '●'}</Text>
  );
}

function VideoStackNavigator() {
  return (
    <VideoStack.Navigator screenOptions={{ headerShown: false }}>
      <VideoStack.Screen name="VideoFeed" component={VideoFeedScreen} />
      <VideoStack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <VideoStack.Screen name="Premium" component={PremiumScreen} />
    </VideoStack.Navigator>
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

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="Premium" component={PremiumScreen} />
      <ProfileStack.Screen name="Privacy" component={PrivacyScreen} />
      <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
      <ProfileStack.Screen name="ConnectedDevices" component={ConnectedDevicesScreen} />
    </ProfileStack.Navigator>
  );
}

function MentorStackNavigator() {
  return (
    <MentorStack.Navigator screenOptions={{ headerShown: false }}>
      <MentorStack.Screen name="MentorHome" component={MentorScreen} />
      <MentorStack.Screen name="MentorDirectory" component={MentorDirectoryScreen} />
      <MentorStack.Screen name="MentorDetail" component={MentorDetailScreen} />
    </MentorStack.Navigator>
  );
}

function CommunityStackNavigator() {
  return (
    <CommunityStack.Navigator screenOptions={{ headerShown: false }}>
      <CommunityStack.Screen name="CommunityFeed" component={CommunityScreen} />
      <CommunityStack.Screen name="Challenges" component={ChallengesScreen} />
      <CommunityStack.Screen name="Leaderboard" component={LeaderboardScreen} />
    </CommunityStack.Navigator>
  );
}

export default function AppNavigator() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{ tabBarLabel: t('tabs.home') }}
      />
      <Tab.Screen
        name="Talks"
        component={TalksStackNavigator}
        options={{ tabBarLabel: t('tabs.talks') }}
      />
      <Tab.Screen
        name="Videos"
        component={VideoStackNavigator}
        options={{ tabBarLabel: t('tabs.videos') }}
      />
      <Tab.Screen
        name="Health"
        component={HealthMetricsScreen}
        options={{ tabBarLabel: t('tabs.health') }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStackNavigator}
        options={{ tabBarLabel: t('tabs.community') }}
      />
      <Tab.Screen
        name="Mentor"
        component={MentorStackNavigator}
        options={{ tabBarLabel: t('tabs.mentor') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: t('tabs.profile') }}
      />
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
