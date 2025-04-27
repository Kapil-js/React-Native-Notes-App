import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import {StatusBar} from 'react-native';
import AddNoteScreen from './src/screens/AddNoteScreen';
import FONT from './src/screens/font';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('hasSeenOnboarding').then(value => {
      if (value === null) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null; // Optional: splash screen or loader
  }

  return (
    <>
      <StatusBar
        backgroundColor="#000"
        barStyle="light-content"
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator>
          {isFirstLaunch && (
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{headerShown: false}}
            />
          )}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddNote"
            component={AddNoteScreen}
            options={{
              headerTitle: 'Add Notes',
              headerTitleAlign: 'center',
              headerBackTitleVisible: false,
              headerShadowVisible: false,
              headerTintColor: '#2A2251',
              headerTitleStyle: {
                fontSize: 18,
                fontFamily: FONT.NunitoSemiBold,
              },
              headerStyle: {
                backgroundColor: '#F9F8FD',
              },
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerTitle: 'Log in',
              headerTitleAlign: 'center',
              headerBackTitleVisible: false,
              headerShadowVisible: false,
              headerTintColor: '#2A2251',
              headerTitleStyle: {
                fontSize: 18,
                fontFamily: FONT.NunitoSemiBold,
              },
              headerStyle: {
                backgroundColor: '#F9F8FD',
              },
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignUpScreen}
            options={{
              headerTitle: 'Sign up',
              headerTitleAlign: 'center',
              headerBackTitleVisible: false,
              headerShadowVisible: false,
              headerTintColor: '#2A2251',
              headerStyle: {
                backgroundColor: '#F9F8FD',
              },
              headerTitleStyle: {
                fontSize: 18,
                fontFamily: FONT.NunitoSemiBold,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
