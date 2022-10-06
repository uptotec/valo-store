import * as SQLite from 'expo-sqlite';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

import { refreshAccessToken } from '../api/axios';
import { getStore } from '../api/store';
import skin from '../constants/skin';

export const BACKGROUND_FETCH_TASK = 'background-fetch';

export default async function backgroundTask() {
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

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 30, // 30 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

export const checkBackgroundTaskStatusAsync = async () => {
  const status = await BackgroundFetch.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_FETCH_TASK
  );
  console.log('registered: ', isRegistered, ' status: ', status);
  if (!isRegistered && status === 3) {
    registerBackgroundFetchAsync();
  }
};
