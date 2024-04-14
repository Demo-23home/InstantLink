import React, { useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { useLayoutEffect } from "react";
import Title from "../common/Title";
import Input from "../common/Input";
import Button from "../common/Button";
import api from "../core/api";
import utils from "../core/utils";
import useGlobal from "../core/global";

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const login = useGlobal((state) => state.login);

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
    api({
      method: "POST",
      url: "accounts/signin/",
      data: {
        username: username,
        password: password,
      },
    })
      .then((response) => {
        utils.log("Sign In:", response.data);

        const credintials = {
          username: username,
          password: password,
        };
        login(credintials, response.data.user, response.data.tokens);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingHorizontal: 20,
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
            <Button
              title="Sign In"
              onPress={() => onSignIn(username, password)}
            />
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
