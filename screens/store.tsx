import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import axios from 'axios';

import { Text, View } from '../components/Themed';
import { Axios } from '../api/axios';
import { useAuthStore } from '../store/auth.store';
import skin from '../constants/skin';
import Colors from '../constants/Colors';

const SkinCard = ({ item }: ListRenderItemInfo<skin>) => (
  <View style={styles.card}>
    <Image
      source={{ uri: item.displayIcon }}
      style={styles.image}
      resizeMode="contain"
    />
    <Text style={styles.title}>{item.displayName}</Text>
  </View>
);

export default function StoreScreen() {
  const puuid = useAuthStore((state) => state.puuid);
  const [store, setStore] = useState<skin[] | null>(null);

  useEffect(() => {
    const getStore = async () => {
      const store = await Axios.get(
        `https://pd.eu.a.pvp.net/store/v2/storefront/${puuid}`
      );

      const dailyStore = [];

      for (const item of store.data.SkinsPanelLayout.SingleItemOffers) {
        const res = await axios.get(
          `https://valorant-api.com/v1/weapons/skinlevels/${item}`
        );
        dailyStore.push({
          displayName: res.data.data.displayName,
          displayIcon: res.data.data.displayIcon,
          uuid: res.data.data.uuid,
        });
      }
      setStore(dailyStore);
    };
    getStore();
  }, []);

  return (
    <View style={styles.container}>
      {store && (
        <FlatList
          style={styles.list}
          data={store}
          renderItem={SkinCard}
          keyExtractor={(item) => item.uuid}
          // ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
