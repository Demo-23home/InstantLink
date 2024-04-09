import { View, Text, TextInput } from "react-native";

function Input({
  title,
  value,
  setValue,
  error,
  setError,
  secureTextEntry = false,
}) {
  return (
    <View>
      <Text
        style={{
          color: error ? "#ff5555" : "#70747a",
          marginVertical: 6,
          paddingLeft: 16,
        }}
      >
        {error ? error : title}
      </Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="off"
        secureTextEntry={secureTextEntry}
        style={{
          backgroundColor: "#e1e2e4",
          borderRadius: 26,
          height: 52,
          paddingHorizontal: 16,
          fontSize: 16,
          borderWidth: 1,
          borderColor: error ? "#ff5555" : "transparent",
        }}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          if (error) {
            setError("");
          }
        }}
      />
    </View>
  );
}

export default Input;
