import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { useLayoutEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

const SignUpScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  function onSignUp() {
    console.log("OnSignUp");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <Input title="Username" />
        <Input title="First Name" />
        <Input title="Last Name" />
        <Input title="Password" />
        <Input title="Comfirm Password" />
        <Button title="Sign Up" onPress={onSignUp}/>
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Already have an account?
          <Text
            style={{
              color: "blue",
            }}
            onPress={() => navigation.navigate("SignIn")}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
