// AppNavigator.js or your navigation setup
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../Screen/Home';
import SearchScreen from '../Screen/Search';
import ImportantScreen from '../Screen/Important';
import AccountScreen from '../Screen/Account';
import MarkAttendance from '../Screen/SubScreen/MarkAttendance';
import Fees from '../Screen/SubScreen/Fees';
import MarkStatement from '../Screen/SubScreen/MarkStatement';
import Documents from '../Screen/SubScreen/Documents';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Create a Stack Navigator for Home tab
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="MarkAttendance" component={MarkAttendance} />
      <Stack.Screen name="Fees" component={Fees} />
      <Stack.Screen name="MarkStatement" component={MarkStatement} />
      <Stack.Screen name="Documents" component={Documents} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Important') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Important" component={ImportantScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}