import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/Home";
import MessagesScreen from "./src/screens/Messages";
import SearchScreen from "./src/screens/Search";
import SignInScreen from "./src/screens/SignIn";
import SignUpScreen from "./src/screens/SignUp";
import { React, useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "./src/core/fontawesome";
import useGlobal from "./src/core/global";


const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

const Stack = createNativeStackNavigator();

function App() {
  // const [initialized] = useState(true);
  const initialized = useGlobal(state => state.initialized)
  const authenticated = useGlobal(state => state.authenticated)
  const init = useGlobal(state => state.init)



  useEffect(()=> {
    init()
  },[])



  return (
    <NavigationContainer theme={lightTheme}>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator>
        {!initialized ? (
          <>
            <Stack.Screen name="Spalsh" component={SplashScreen} />
          </>
        ) : !authenticated ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
