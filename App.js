
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import des écrans
import SplashScreen from './screens/SplashScreen';
import Loginscreen from './screens/Loginscreen';
import Agrisagescreen from './screens/Agrisagescreen';
import Marchscreen from './screens/Marchscreen';
import Accueil from './screens/Accueil';
import SignupScreen from './screens/SignupScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Loginscreen} />
        <Stack.Screen name="Agrisage" component={Agrisagescreen} />
        <Stack.Screen name="MarchScreen" component={Marchscreen} />
        <Stack.Screen name="Accueil" component={Accueil} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

