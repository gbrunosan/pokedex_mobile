import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './screens/LoginScreen';
import PokedexScreen from './screens/PokedexScreen';
import FavoritesScreen from './screens/FavoritesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#CC0000" translucent={false} />
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Pokedex"
          component={PokedexScreen}
          options={{
            headerShown: true,
            title: 'Pokedex',
            headerStyle: { backgroundColor: '#CC0000' },
            headerTintColor: '#fff',
            headerBackVisible: false // Hide back button since we have logout
          }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            headerShown: true,
            title: 'Meus Favoritos',
            headerStyle: { backgroundColor: '#CC0000' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
