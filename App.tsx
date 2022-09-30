import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import { refreshAccessToken } from './api';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import skin from './constants/skin';
import { getStore } from './api/store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const BACKGROUND_FETCH_TASK = 'background-fetch';

SplashScreen.preventAutoHideAsync();

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const loggedIn = await refreshAccessToken();

  if (!loggedIn) return;

  const db = SQLite.openDatabase('db.db');

  const today = new Date(new Date().toUTCString()).toDateString();

  const run = await new Promise(async (resolve) =>
    db.transaction((tx) => {
      tx.executeSql(
        `select * from notifications where date = ?;`,
        [today],
        (_, { rows: { _array } }) => resolve(_array.length === 0)
      );
    })
  );
  if (!run) return;

  const store = await getStore(loggedIn.puuid!);

  const dblist = await new Promise<any[]>(async (resolve) =>
    db.transaction((tx) => {
      tx.executeSql(
        `select * from wishlist where puuid = ?;`,
        [loggedIn.puuid!],
        (_, { rows: { _array } }) => resolve(_array)
      );
    })
  );

  const inWishlist: skin[] = [];

  for (const item of store) {
    for (const wish of dblist) {
      if (wish.uuid === item.uuid) {
        inWishlist.push(item);
      }
    }
  }

  if (inWishlist.length > 0) {
    for (const item of inWishlist) {
      triggerSkinNotifications(item);
    }
  }

  await new Promise(async (resolve) =>
    db.transaction((tx) => {
      tx.executeSql(
        'insert into notifications (date) values (?);',
        [today],
        () => resolve(undefined)
      );
    })
  );

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 30, // 30 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

const triggerSkinNotifications = async (skins: skin) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `congratulations ${skins.displayName} is in your store 🎉`,
      vibrate: [0, 250, 250, 250],
    },
    trigger: null,
  });
};

export default function App() {
  const isLoadingComplete = useCachedResources();

  const [appIsReady, setAppIsReady] = useState(false);

  const checkBackgroundTaskStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    console.log('registered: ', isRegistered, ' status: ', status);
    if (!isRegistered && status === 3) {
      registerBackgroundFetchAsync();
    }
  };

  async function prepare() {
    try {
      // const resetdb = SQLite.openDatabase('db.db');
      // resetdb.closeAsync();
      // resetdb.deleteAsync();

      const db = SQLite.openDatabase('db.db');

      db.transaction((tx) => {
        tx.executeSql(
          'create table if not exists wishlist (id integer primary key not null, puuid text, uuid text);'
        );
      });
      db.transaction((tx) => {
        // tx.executeSql('DROP TABLE notifications;');
        tx.executeSql(
          'create table if not exists notifications (id integer primary key not null, date text);'
        );
      });
      await refreshAccessToken();
    } catch (e) {
      console.warn(e);
    } finally {
      setAppIsReady(true);
    }
  }

  async function checkNotificationPermisions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  }

  const triggernewStoreNotification = async () => {
    // await Notifications.cancelAllScheduledNotificationsAsync();
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();

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
        sound: false,
      },
      trigger: {
        hour: 0 + time.getHours(),
        minute: 0 + time.getMinutes(),
        repeats: true,
      },
      identifier: 'daily',
    });
  };

  useEffect(() => {
    prepare();
    checkNotificationPermisions();
    checkBackgroundTaskStatusAsync();
    triggernewStoreNotification();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <Navigation colorScheme="dark" />
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }
}
