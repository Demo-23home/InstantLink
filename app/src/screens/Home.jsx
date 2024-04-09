import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RequestsScreen from "./Requests";
import FriendsScreen from "./Friends";
import ProfileScreen from "./Profile";
import { useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import {
//   faUser,
//   faUserFriends,
//   faUserCircle,
// }
// from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity, View } from "react-native";

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerRight: () => (
          <TouchableOpacity>
            <FontAwesomeIcon
              style={{ marginRight: 16 }}
              icon="magnifying-glass"
              size={22}
              color="#404040"
            />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Requests: "bell",
            Friends: "inbox",
            Profile: "user",
          };
          const icon = icons[route.name];
          return <FontAwesomeIcon icon={icon} size={28} color={color} />;
        },
        tabBarActiveTintColor: "#202020",
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
