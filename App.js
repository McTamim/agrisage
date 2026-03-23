import 'react-native-reanimated';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import des écrans
import SplashScreen from './screens/SplashScreen';
import Loginscreen from './screens/Loginscreen';
import Marchescreen from './screens/Marchescreen';
import Accueil from './screens/Accueil';
import SignupScreen from './screens/SignupScreen';
import Experts from './screens/Experts';
import parametre from './screens/parametre';
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
        <Stack.Screen name="Marcher" component={Marchescreen} />
        <Stack.Screen name="Accueil" component={Accueil} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Experts" component={Experts} />
       <Stack.Screen name="parametre" component={parametre} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

