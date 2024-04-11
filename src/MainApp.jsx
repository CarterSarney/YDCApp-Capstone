// src/MainApp.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomePage from './screens/HomeScreen';
import Schedule from './screens/Schedule';
import FoodInput from './screens/Food';
import ChatList from './screens/ChatList';
import Dashboard from './screens/Dashboard';

const Tab = createBottomTabNavigator();

const MainApp = () => {
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
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Schedule" component={Schedule} />
      <Tab.Screen name="Food" component={FoodInput} />
      <Tab.Screen name="ChatList" component={ChatList} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
    </Tab.Navigator>
  );
};

export default MainApp;
