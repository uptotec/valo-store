import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import * as SplashScreen from 'expo-splash-screen';
import { refreshAccessToken } from './api';
import * as SQLite from 'expo-sqlite';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const db = SQLite.openDatabase('db.db');

        db.transaction((tx) => {
          tx.executeSql(
            'create table if not exists wishlist (id integer primary key not null, puuid text, uuid text);'
          );
        });
        await refreshAccessToken();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
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
