import { React, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { useLayoutEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import api from "../core/api";
import useGlobal from "../core/global";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [password1Error, setPassword1Error] = useState("");
  const [password2Error, setPassword2Error] = useState("");

  const login = useGlobal((state) => state.login);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  function onSignUp() {
    console.log("OnSignUp");

    // Check username
    const failUsername = !username || username.length < 5;
    if (failUsername) {
      setUsernameError("Username Must Be >= 5 Characters");
    }
    //Check Firstname
    const failFirstName = !firstName;
    if (failUsername) {
      setFirstNameError("Frist Name Not Provided");
    }
    // Check LastName
    const failLastName = !lastName;
    if (failLastName) {
      setLastNameError("Last Name Not Provided");
    }
    // Check Password1
    const failPassword1 = !password1 || password1.length < 8;
    if (failPassword1) {
      setPassword1Error("Password is too short!");
    }
    // Check Password2
    const failPassword2 = password1 !== password2;
    if (failPassword2) {
      setPassword2Error("Passwords Don't Match!");
    }
    // Break Out Of The Function If There Were An Error
    if (
      failFirstName ||
      failLastName ||
      failUsername ||
      failPassword1 ||
      failPassword2
    ) {
      return;
    }

    // Make Signin Request
    api({
      method: "POST",
      url: "accounts/signup/",
      data: {
        username: username,
        first_name: firstName,
        last_name: lastName,
        password: password1,
      },
    })
      .then((response) => {
        utils.log("Sign Un:", response.data);
        const credintials = {
          username: username,
          password: password1,
        };
        login(credintials ,response.data.user);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16 }}
          >
            <Text
              style={{
                textAlign: "center",
                marginBottom: 24,
                fontSize: 36,
                fontWeight: "bold",
              }}
            >
              Sign Up
            </Text>

            <Input
              title="Username"
              value={username}
              setValue={setUsername}
              error={usernameError}
              setError={setUsernameError}
            />

            <Input
              title="First Name"
              value={firstName}
              setValue={setFirstName}
              error={firstNameError}
              setError={setFirstNameError}
            />

            <Input
              title="Last Name"
              value={lastName}
              setValue={setLastName}
              error={lastNameError}
              setError={setLastNameError}
            />

            <Input
              title="Password"
              value={password1}
              setValue={setPassword1}
              error={password1Error}
              setError={setPassword1Error}
              secureTextEntry={true}
            />

            <Input
              title="Comfirm Password"
              value={password2}
              setValue={setPassword2}
              error={password2Error}
              setError={setPassword2Error}
              secureTextEntry={true}
            />

            <Button title="Sign Up" onPress={onSignUp} />
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              Already have an account
              <Text
                style={{
                  color: "blue",
                }}
                onPress={() => navigation.navigate("SignIn")}
              >
                ? Sign In
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
