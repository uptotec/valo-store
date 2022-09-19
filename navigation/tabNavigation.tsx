import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabStackParamList } from '../types';
import Colors from '../constants/Colors';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useThemeColor } from '../components/Themed';
import StoreScreen from '../screens/store';
import WishListScreen from '../screens/wishlist';
import ProfileScreen from '../screens/profile';

const Tab = createBottomTabNavigator<TabStackParamList>();

export default function TabNavigator() {
  const tabColorDefault = useThemeColor({}, 'tabIconDefault');
  const tabColorFocused = useThemeColor({}, 'tabIconSelected');

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
        }}
      />
    </Tab.Navigator>
  );
}
