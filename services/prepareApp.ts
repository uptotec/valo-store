import * as SQLite from 'expo-sqlite';
import { refreshAccessToken } from '../api/axios';

export default async function prepareApp(setAppIsReady: (x: boolean) => void) {
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
    setAppIsReady(true);
  } catch (e) {
    console.warn(e);
  }
}
