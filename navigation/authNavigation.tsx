import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '../store/auth.store';
import { AuthStackParamList } from '../types';
import PickRegion from '../screens/auth/pickRegion';
import Colors from '../constants/Colors';
import SignIn from '../screens/auth/signin';
import TabNavigator from './tabNavigation';
import AddWishScreen from '../screens/addWish';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  if (isSignedIn) {
    return (
      <Stack.Navigator
        screenOptions={{
          navigationBarColor: Colors.dark.main,
          headerStyle: { backgroundColor: Colors.dark.main },
        }}
      >
        <Stack.Screen
          name="Root"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="AddWish" component={AddWishScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        navigationBarColor: Colors.dark.main,
        headerStyle: { backgroundColor: Colors.dark.main },
      }}
    >
      <Stack.Screen
        name="pickRegion"
        component={PickRegion}
        options={{ title: 'Valo Store' }}
      />
      <Stack.Screen
        name="signin"
        component={SignIn}
        options={{ title: 'Sign In To Your Account' }}
      />
    </Stack.Navigator>
  );
}
