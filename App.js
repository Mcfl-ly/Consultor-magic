import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomePage/index'
import SearchScreen from './components/SearchScreen/index'
import DeckScreen from './components/DeckScreen/index'


const Stack = createNativeStackNavigator();
export default function App({navigation}) {
  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
              <Stack.Screen name="DeckScreen" component={DeckScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

