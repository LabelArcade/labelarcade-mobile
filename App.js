import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens'; // ✅ Enables native screen optimizations

// Enable screen optimizations
enableScreens();

// Import all screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TaskScreen from './screens/TaskScreen';
import SubmissionHistoryScreen from './screens/SubmissionHistoryScreen';
import AverageTimeChartScreen from './screens/AverageTimeChartScreen';
import LeaderboardScreen from './screens/LeaderboardScreen'; // ✅ Confirm this file exists

// Create navigation stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Task" component={TaskScreen} />
        <Stack.Screen name="Submissions" component={SubmissionHistoryScreen} />
        <Stack.Screen name="AvgTimeChart" component={AverageTimeChartScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
