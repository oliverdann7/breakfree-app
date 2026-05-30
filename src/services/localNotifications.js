// Local notification scheduling — workout reminders, mentor sessions,
// challenge deadlines, daily wellness nudges. Wraps expo-notifications with
// a graceful no-op when the module isn't installed (web fallback).

let Notifications = null;

async function getModule() {
  if (Notifications) return Notifications;
  try {
    Notifications = await import('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    return Notifications;
  } catch {
    return null;
  }
}

export async function scheduleWellnessReminder({ hour = 21, minute = 30 } = {}) {
  const N = await getModule();
  if (!N) return null;
  return N.scheduleNotificationAsync({
    content: {
      title: 'Wellness anı',
      body: 'Bugün için bir dakikalık nefes egzersizine ne dersin?',
      data: { route: 'Sağlık' },
    },
    trigger: { hour, minute, repeats: true },
  });
}

export async function scheduleMentorReminder({ sessionId, date, mentorName }) {
  const N = await getModule();
  if (!N) return null;
  const trigger = new Date(date);
  trigger.setMinutes(trigger.getMinutes() - 60);
  return N.scheduleNotificationAsync({
    content: {
      title: `${mentorName} ile seansın 1 saat sonra`,
      body: 'Hazırlık için odanı sessizleştir, su ve not defterini yanına al.',
      data: { route: 'MentorDetail', params: { sessionId } },
    },
    trigger,
  });
}

export async function scheduleChallengeDeadline({ challengeId, title, endDate }) {
  const N = await getModule();
  if (!N) return null;
  const trigger = new Date(endDate);
  trigger.setHours(trigger.getHours() - 24);
  return N.scheduleNotificationAsync({
    content: {
      title: 'Meydan okuma bitiyor',
      body: `${title} için 24 saat kaldı. Son sprint!`,
      data: { route: 'Leaderboard', params: { challengeId } },
    },
    trigger,
  });
}

export async function cancelScheduled(id) {
  const N = await getModule();
  if (!N || !id) return;
  return N.cancelScheduledNotificationAsync(id);
}

export async function cancelAll() {
  const N = await getModule();
  if (!N) return;
  return N.cancelAllScheduledNotificationsAsync();
}

export async function getScheduled() {
  const N = await getModule();
  if (!N) return [];
  return N.getAllScheduledNotificationsAsync();
}
