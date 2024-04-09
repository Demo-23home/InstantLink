import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLayoutEffect } from "react";
import Title from "../common/Title";
import Input from "../common/Input";
import Button from "../common/Button";
import { faI } from "@fortawesome/free-solid-svg-icons";

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function onSignIn(username, password) {
    console.log(username, password);

    // Check Username
    const failUsername = !username;
    if (failUsername) {
      setUsernameError("Username Not Provided");
    }
    // Check Password
    const failPassword = !password;
    if (failPassword) {
      setPasswordError("Password Not Provided");
    }
    // Break Of the function if there were an error
    if (failUsername || failPassword) {
      return;
    }

    // Make Signin Request
    // ...
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Title text="Realtime Chat" color="#202020" />
        <Input
          title="Username"
          value={username}
          setValue={setUsername}
          error={usernameError}
          setError={setUsernameError}
        />
        <Input
          title="Password"
          value={password}
          setValue={setPassword}
          error={passwordError}
          setError={setPasswordError}
          secureTextEntry={true}
        />
        <Button title="Sign In" onPress={() => onSignIn(username, password)} />
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Don't have an account
          <Text
            style={{
              color: "blue",
            }}
            onPress={() => navigation.navigate("SignUp")}
          >
            ? Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;
