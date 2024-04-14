import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RequestsScreen from "./Requests";
import FriendsScreen from "./Friends";
import ProfileScreen from "./Profile";
import { useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity, View, Image } from "react-native";
import useGlobal from "../core/global";
import Thumbnail from "../common/Thumbnail";


const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const socketConnect = useGlobal(state => state.socketConnect)
  const socketClose = useGlobal(state => state.socketClose)
  const user = useGlobal(state => state.user)  
  useEffect(()=> {
    socketConnect()
    return () =>{
      socketClose()
    }
  }, [])


  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerLeft: () => (
          <View style={{ marginLeft: 12, marginTop: 4 }}>
          <Thumbnail
            url={user.thumbnail}
            size = {30}
          />
          </View>
        ),

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
