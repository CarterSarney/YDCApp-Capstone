// src/MainApp.jsx
import React, { createContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import Schedule from './screens/Schedule';
import FoodInput from './screens/Food';
import ChatList from './screens/ChatList';
import Dashboard from './screens/Dashboard';
import { auth } from '../Firebase/firebaseConfig';

const Tab = createBottomTabNavigator();

const MainApp = async () => {
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Food') {
            iconName = focused ? 'food' : 'food-variant';
          } else if (route.name === 'ChatList') {
            iconName = focused ? 'chat' : 'chat-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{userEmail, userRole, userUID}}/>
      <Tab.Screen name="Schedule" component={Schedule} initialParams={{userEmail, userRole, userUID}}/>
      <Tab.Screen name="Food" component={FoodInput} initialParams={{userEmail, userRole, userUID}}/>
      <Tab.Screen name="ChatList" component={ChatList} initialParams={{userEmail, userRole, userUID}}/>
      <Tab.Screen name="Dashboard" component={Dashboard} initialParams={{userEmail, userRole, userUID}}/>
    </Tab.Navigator>
  );
};

export default MainApp;
