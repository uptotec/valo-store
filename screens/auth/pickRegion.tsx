import { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import { Button, Text, View } from '../../components/Themed';
import regions from '../../constants/regions';
import useColorScheme from '../../hooks/useColorScheme';

export default function PickRegion() {
  const colorScheme = useColorScheme();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [value, setValue] = useState(null);
  const navigation = useNavigation();

  const onSignIn = async () => {
    if (value) {
      await SecureStore.setItemAsync('region', value);
      setError(false);
    } else {
      setError(true);
      return;
    }
    navigation.navigate('signin' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>pick region</Text>
      <View style={styles.separator} />
      <DropDownPicker
        open={open}
        value={value}
        items={regions}
        setOpen={setOpen}
        setValue={setValue}
        theme={colorScheme === 'dark' ? 'DARK' : 'LIGHT'}
        placeholder="select region"
        containerStyle={styles.dropdown}
      />
      {error && <Text style={{ color: 'red' }}>select region</Text>}
      <View style={styles.separator} />
      <Button text="sign in" onPress={() => onSignIn()} />
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
    marginVertical: 15,
    height: 1,
    width: '80%',
  },
  dropdown: {
    width: Dimensions.get('window').width * 0.7,
    alignSelf: 'center',
  },
});
