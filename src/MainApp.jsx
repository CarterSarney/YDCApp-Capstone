// src/MainApp.jsx
import React, { createContext, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import Schedule from './screens/Schedule';
import FoodInput from './screens/Food';
import ChatList from './screens/ChatList';
import Dashboard from './screens/Dashboard';
import { auth } from '../Firebase/firebaseConfig';

const Tab = createBottomTabNavigator();

const MainApp = () => {
  const route = useRoute();
  const { userEmail, userUID, userRole } = route.params;

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
        tabBarActiveTintColor: '#1170FF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ userRole, userEmail }}/>
      {(userRole == 'Admin User' || userRole == 'Volunteer User') && (
        <Tab.Screen name="Schedule" component={Schedule} initialParams={{ userRole, userUID }}/>
      )}
      <Tab.Screen name="Food" component={FoodInput} initialParams={{ userRole }}/>
      <Tab.Screen name="ChatList" component={ChatList} initialParams={{userUID}} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
    </Tab.Navigator>
  );
};

export default MainApp;
