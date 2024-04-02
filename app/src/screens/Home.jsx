import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RequestsScreen from './Requests';
import FriendsScreen from './Friends';
import ProfileScreen from './Profile';
import {useLayoutEffect} from 'react';

const Tab = createBottomTabNavigator();

const HomeScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Requests" component={RequestsScreen} />

      <Tab.Screen name="Friends" component={FriendsScreen}></Tab.Screen>
      <Tab.Screen name="Profile" component={ProfileScreen}></Tab.Screen>
    </Tab.Navigator>
  );
};

export default HomeScreen;
