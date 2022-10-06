import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import * as SQLite from 'expo-sqlite';

import { Text, View } from '../components/Themed';
import { useAuthStore } from '../store/auth.store';
import skin from '../constants/skin';
import Colors from '../constants/Colors';
import SkinCard from '../components/card';
import { useNavigation } from '@react-navigation/native';

export default function WishListScreen() {
  const navigation = useNavigation();
  const puuid = useAuthStore((state) => state.puuid);
  const [wishList, setWishList] = useState<skin[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getStore = async () => {
      const db = SQLite.openDatabase('db.db');

      const dblist = await new Promise<any[]>(async (resolve) =>
        db.transaction((tx) => {
          tx.executeSql(
            `select * from wishlist where puuid = ?;`,
            [puuid],
            (_, { rows: { _array } }) => resolve(_array)
          );
        })
      );

      const list: skin[] = [];

      for (const item of dblist.sort((a, b) => b.id - a.id)) {
        const res = await axios.get(
          `https://valorant-api.com/v1/weapons/skinlevels/${item.uuid}`
        );
        list.push({
          displayName: res.data.data.displayName,
          displayIcon: res.data.data.displayIcon,
          uuid: res.data.data.uuid,
          levels: null,
        });
      }
      setWishList(list);
      setLoading(false);
    };

    const willFocusWishlist = navigation.addListener('focus', () => {
      getStore();
    });

    return willFocusWishlist;
  }, []);

  const removeWishlistItem = async (item: skin) => {
    const db = SQLite.openDatabase('db.db');

    await new Promise<any[]>(async (resolve) =>
      db.transaction((tx) => {
        tx.executeSql(
          `delete from wishlist where puuid = ? and uuid = ?;`,
          [puuid, item.uuid],
          () => {
            setWishList(wishList!.filter((wish) => wish.uuid !== item.uuid));
          }
        );
      })
    );
  };

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size={55} color="#fff" />
        <Text>loading wishlist...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {wishList && (
        <FlatList
          style={styles.list}
          data={wishList}
          ListEmptyComponent={() => (
            <Text style={[styles.title, { margin: 20 }]}>
              Your Wishlist Is Empty
            </Text>
          )}
          renderItem={(props) => (
            <SkinCard
              {...props}
              showButtonAdd={false}
              showButtonRemove={true}
              onPressRemove={removeWishlistItem}
            />
          )}
          keyExtractor={(item) => item.uuid}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  card: {
    width: Dimensions.get('window').width - 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.dark.main,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  image: {
    width: '90%',
    height: Dimensions.get('window').height * 0.15,
    marginBottom: 15,
  },
  list: {},
});
