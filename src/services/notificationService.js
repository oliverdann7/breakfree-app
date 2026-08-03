import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async (uid) => {
  if (Platform.OS === 'web') return null;

  // Android 8+ drops notifications without a channel.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Genel',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  try {
    // getExpoPushTokenAsync throws in production builds unless the EAS
    // projectId is resolvable — pass it explicitly.
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined))
      .data;

    if (db && uid) {
      await setDoc(
        doc(db, 'users', uid),
        { pushToken: token, pushTokenUpdatedAt: Date.now() },
        { merge: true }
      );
    }

    return token;
  } catch (error) {
    // Don't crash sign-in over push registration, but leave a trace —
    // a silent null here cost us production push entirely once.
    console.warn('[push] registration failed:', error?.message || error);
    return null;
  }
};

export const scheduleDailyReminder = async (hour, minute, title, body) => {
  await Notifications.cancelScheduledNotificationAsync('daily-wellness-reminder');
  await Notifications.scheduleNotificationAsync({
    identifier: 'daily-wellness-reminder',
    content: {
      title: title || 'BreakFree',
      body: body || 'Bugünkü wellness hedeflerine baktın mı?',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
};

export const scheduleGoalReminder = async (title, body, secondsFromNow) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title || 'Hatırlatıcı',
      body: body || 'Hedefini tamamlaman için harika bir zaman!',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsFromNow || 3600,
    },
  });
};

export const cancelAllScheduledNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Accepts a ref from createNavigationContainerRef (methods live on the ref
// itself, not on .current).
export const setupNotificationResponseHandler = (navigationRef) => {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    if (data?.screen && navigationRef?.isReady?.()) {
      navigationRef.navigate(data.screen, data.params || {});
    }
  });
  return subscription;
};

export const getLastNotificationResponse = async () => {
  return Notifications.getLastNotificationResponseAsync();
};
