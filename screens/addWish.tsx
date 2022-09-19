import axios from 'axios';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, TextInput } from 'react-native';
import SkinCard from '../components/card';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';

import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import skin from '../constants/skin';
import useDebounce from '../hooks/UseDebounce';
import { useAuthStore } from '../store/auth.store';

export default function AddWishScreen() {
  const [skins, setSkins] = useState<skin[] | null>(null);
  const [search, setSearch] = useState<skin[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const puuid = useAuthStore((state) => state.puuid);
  const navigation = useNavigation();

  useEffect(() => {
    const getSkins = async () => {
      const list = await axios.get('https://valorant-api.com/v1/weapons/skins');

      setSkins(list.data.data);
      setSearch(list.data.data);
    };
    getSkins();
  }, []);

  useDebounce(
    () => {
      if (!skins) return;
      if (searchQuery === '') {
        setSearch(skins);
        return;
      }

      const results = skins.filter((item) =>
        item.displayName.toLowerCase().includes(searchQuery.toLocaleLowerCase())
      );
      setSearch(results);
    },
    [searchQuery],
    300
  );

  const addToWishlist = async (item: skin) => {
    const db = SQLite.openDatabase('db.db');

    let doesExist = await new Promise(async (resolve) =>
      db.transaction((tx) => {
        tx.executeSql(
          `select * from wishlist where puuid = ? and uuid = ?;`,
          [puuid, item.levels![0].uuid],
          (_, { rows: { _array } }) => {
            resolve(_array.length > 0);
          }
        );
      })
    );

    if (doesExist) {
      navigation.goBack();
      return;
    }

    await new Promise(async (resolve) =>
      db.transaction((tx) => {
        tx.executeSql(
          'insert into wishlist (puuid, uuid) values (?, ?);',
          [puuid, item.levels![0].uuid],
          () => {
            resolve(undefined);
          }
        );
      })
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#fff"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        placeholder="Search Skin"
      />
      <FlatList
        style={styles.list}
        data={search}
        renderItem={(props) => (
          <SkinCard
            {...props}
            showButtonAdd={true}
            onPressAdd={addToWishlist}
            showButtonRemove={false}
          />
        )}
        keyExtractor={(item) => item.uuid}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
      />
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
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  list: {},
  input: {
    height: 40,
    width: Dimensions.get('window').width - 10,
    marginVertical: 10,
    padding: 10,
    backgroundColor: Colors.dark.main,
    borderRadius: 5,
    elevation: 10,
    color: '#fff',
  },
});
