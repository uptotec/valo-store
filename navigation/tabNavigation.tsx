import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabStackParamList } from '../types';
import Colors from '../constants/Colors';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Text, useThemeColor } from '../components/Themed';
import StoreScreen from '../screens/store';
import WishListScreen from '../screens/wishlist';
import ProfileScreen from '../screens/profile';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from '../api/axios';

const Tab = createBottomTabNavigator<TabStackParamList>();

export default function TabNavigator() {
  const tabColorFocused = useThemeColor({}, 'tabIconSelected');
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: Colors.dark.main },
        headerStyle: { backgroundColor: Colors.dark.main },
        tabBarActiveTintColor: tabColorFocused,
      }}
    >
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          title: 'Your Store',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="store" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="WishList"
        component={WishListScreen}
        options={{
          title: 'Your Wishlist',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="star" size={size} color={color} />
          ),
          headerRight: ({ tintColor }) => (
            <TouchableOpacity
              style={{ marginRight: 15, padding: 5 }}
              onPress={() => navigation.navigate('AddWish' as never)}
            >
              <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'YourProfile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-alt" size={size} color={color} />
          ),
          headerRight: ({ tintColor }) => (
            <TouchableOpacity
              style={{ marginRight: 15, padding: 5 }}
              onPress={signOut}
            >
              <Text>Signout</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
