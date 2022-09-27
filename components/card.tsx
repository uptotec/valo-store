import {
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Colors from '../constants/Colors';
import { Button, Text, View } from './Themed';
import skin from '../constants/skin';
import { FontAwesome } from '@expo/vector-icons';
import { useAssets } from 'expo-asset';

export default function SkinCard({
  item,
  showButtonAdd,
  showButtonRemove,
  onPressAdd,
  onPressRemove,
  style,
}: ListRenderItemInfo<skin> & {
  showButtonAdd: boolean;
  showButtonRemove: boolean;
  onPressAdd?: (item: skin) => void;
  onPressRemove?: (item: skin) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const [assets, error] = useAssets([
    require('../assets/images/Valorant_Points.png'),
  ]);

  return (
    <View style={styles.card}>
      {assets && item.price && (
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <Image
            source={assets[0] as any}
            style={styles.vp}
            resizeMode="contain"
          />
        </View>
      )}
      <Image
        source={{ uri: item.displayIcon }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{item.displayName}</Text>
      {showButtonAdd && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#13141c' }]}
          onPress={onPressAdd ? () => onPressAdd(item) : undefined}
        >
          <Text>add to wishlist</Text>
        </TouchableOpacity>
      )}
      {showButtonRemove && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#b30000' }]}
          onPress={onPressRemove ? () => onPressRemove(item) : undefined}
        >
          <FontAwesome name="trash" size={20} color="white" />
        </TouchableOpacity>
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
    alignSelf: 'flex-start',
  },
  priceContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: undefined,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  vp: {
    width: 24,
    height: 24,
    marginHorizontal: 5,
    marginBottom: 15,
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
    marginVertical: 15,
    // transform: [{ rotate: '30deg' }],
  },
  button: {
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 15,
  },
});
