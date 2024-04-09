import React from "react";
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





const SignInScreen = ({ navigation }) => {
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
        <Input title="Username" />
        <Input title="Password" />
        <Button title="Sign In" />
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Don't have an account?
          <Text
            style={{
              color: "blue",
            }}
            onPress={() => navigation.navigate('SignUp')}
          >
             Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;
