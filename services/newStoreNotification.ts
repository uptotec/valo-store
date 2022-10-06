import * as Notifications from 'expo-notifications';

const triggernewStoreNotification = async () => {
  // await Notifications.cancelAllScheduledNotificationsAsync();
  const notifications = await Notifications.getAllScheduledNotificationsAsync();

  let addNotification = true;

  for (const notification of notifications) {
    if (notification.identifier === 'daily') addNotification = false;
  }

  if (!addNotification) return;

  const time = new Date('9/30/2022 12:00:00 AM UTC');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `your new store is now avilable ✨`,
      vibrate: [0, 250, 250, 250],
      sound: true,
    },
    trigger: {
      hour: 0 + time.getHours(),
      minute: 0 + time.getMinutes(),
      repeats: true,
    },
    identifier: 'daily',
  });
};

export default triggernewStoreNotification;
