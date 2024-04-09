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

function Input({ title }) {
  return (
    <View>
      <Text
        style={{
          color: "#70747a",
          marginVertical: 6,
          paddingLeft: 16,
        }}
      >
        {title}
      </Text>
      <TextInput
        style={{
          backgroundColor: "#e1e2e4",
          borderRadius: 26,
          height: 52,
          paddingHorizontal: 16,
          fontSize: 16,
        }}
      />
    </View>
  );
}

function Button({ title }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#202020",
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

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
            Sing Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;
