import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async (uid) => {
  if (Platform.OS === 'web') return null;

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
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    if (db && uid) {
      await setDoc(
        doc(db, 'users', uid),
        { pushToken: token, pushTokenUpdatedAt: Date.now() },
        { merge: true }
      );
    }

    return token;
  } catch {
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

export const setupNotificationResponseHandler = (navigationRef) => {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    if (data?.screen && navigationRef?.current) {
      navigationRef.current.navigate(data.screen, data.params || {});
    }
  });
  return subscription;
};

export const getLastNotificationResponse = async () => {
  return Notifications.getLastNotificationResponseAsync();
};
