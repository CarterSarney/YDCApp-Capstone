// App.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';

import Polling from './src/screens/components/Polling';
import Chat from './src/screens/Chat';
// Import your authentication screens
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';

// Import MainApp
import MainApp from './src/MainApp'; // If MainApp.jsx is directly in the src directory


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          {/* MainApp includes the bottom tab navigation */}
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="Polling" component={Polling} />
          <Stack.Screen name="Chat" component={Chat} />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
