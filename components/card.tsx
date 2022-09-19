import {
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
  Image,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import { Button, Text, View } from './Themed';
import skin from '../constants/skin';
import { FontAwesome } from '@expo/vector-icons';

export default function SkinCard({
  item,
  showButtonAdd,
  showButtonRemove,
  onPressAdd,
  onPressRemove,
}: ListRenderItemInfo<skin> & {
  showButtonAdd: boolean;
  showButtonRemove: boolean;
  onPressAdd?: (item: skin) => void;
  onPressRemove?: (item: skin) => void;
}) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.displayIcon }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{item.displayName}</Text>
      {showButtonAdd && (
        <TouchableOpacity
          style={styles.button}
          onPress={onPressAdd ? () => onPressAdd(item) : undefined}
        >
          <Text>add to wishlist</Text>
        </TouchableOpacity>
      )}
      {showButtonRemove && (
        <TouchableOpacity
          style={styles.button}
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
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#b30000',
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
